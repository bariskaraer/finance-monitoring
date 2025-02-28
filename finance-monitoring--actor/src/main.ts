import { Actor, log } from "apify";
import {
    OpenAIProvider,
    AnthropicProvider,
    GoogleProvider,
    getProvider,
} from "./providers/index.js";
import { Input, OutputItem, PromptChainStep } from "./types.js";
import { CheerioCrawler, Dataset } from "crawlee";
// import { router } from './routes.js';

// interface Input {
//     startUrls: string[];
//     maxRequestsPerCrawl: number;
// }

// Rate limits for OpenAI API lowest tier
const RATE_LIMIT_PER_MINUTE = 500;
const REQUEST_INTERVAL_MS = Math.ceil(60000 / RATE_LIMIT_PER_MINUTE); // Interval between requests in ms

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// Helper function to get nested field value using dot notation
function getNestedValue(obj: any, path: string): any {
    return path
        .split(".")
        .reduce((current, key) => current && current[key], obj);
}

// Helper function to check if a value is empty
function isEmpty(value: any): boolean {
    if (value === undefined || value === null) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}

// Helper function to check if any placeholder field is empty
function hasEmptyFields(promptStr: string, item: OutputItem): boolean {
    const fieldMatches = promptStr.match(/\$\{([^}]+)\}/g) || [];
    return fieldMatches.some((match) => {
        const field = match.slice(2, -1).trim(); // Remove ${ and }
        const value = getNestedValue(item, field);
        return isEmpty(value);
    });
}

// Helper function to replace field placeholders in prompt with actual values
function replacePlaceholders(promptStr: string, item: OutputItem): string {
    return promptStr.replace(/\$\{([^}]+)\}/g, (_match, fieldName: string) => {
        const value = getNestedValue(item, fieldName.trim());
        return value !== undefined ? String(value) : "";
    });
}

async function validateInput(): Promise<{
    inputDatasetId: string;
    llmProviderApiKey: string;
    promptChain: PromptChainStep[];
    skipItemIfEmpty: boolean;
    multipleColumns: boolean;
    testPrompt: boolean;
    testItemsCount: number;
}> {
    const input = (await Actor.getInput()) as Input;
    if (!input) {
        throw new Error(
            "No input provided. Please provide the necessary input parameters."
        );
    }

    const {
        llmProviderApiKey,
        promptChain,
        skipItemIfEmpty,
        multipleColumns = false,
        testPrompt = false,
        testItemsCount = 3,
    } = input;

    if (
        !promptChain ||
        !Array.isArray(promptChain) ||
        promptChain.length === 0
    ) {
        throw new Error(
            "No promptChain provided. Please provide at least one prompt in the chain."
        );
    }

    // Validate each step in the chain
    for (const [index, step] of promptChain.entries()) {
        if (!step.prompt || typeof step.prompt !== "string") {
            throw new Error(
                `Prompt chain step ${
                    index + 1
                } is missing a valid prompt string`
            );
        }
        if (!step.responseField || typeof step.responseField !== "string") {
            throw new Error(
                `Prompt chain step ${
                    index + 1
                } is missing a valid responseField`
            );
        }
    }

    const inputDatasetId =
        input?.inputDatasetId || input?.payload?.resource?.defaultDatasetId;

    if (!inputDatasetId) {
        throw new Error(
            "No inputDatasetId provided. Please provide the necessary input parameters."
        );
    }

    return {
        inputDatasetId,
        llmProviderApiKey,
        promptChain,
        skipItemIfEmpty: skipItemIfEmpty ?? false,
        multipleColumns,
        testPrompt,
        testItemsCount,
    };
}

async function fetchDatasetItems(
    inputDatasetId: string,
    testPrompt: boolean,
    testItemsCount: number
): Promise<OutputItem[]> {
    try {
        const dataset = await Actor.apifyClient.dataset(inputDatasetId).get();
        if (!dataset) {
            throw new Error(`Dataset with ID ${inputDatasetId} does not exist`);
        }

        const inputDataset = await Actor.openDataset<OutputItem>(
            inputDatasetId
        );
        const { items: fetchedItems } = await inputDataset.getData();

        if (testPrompt) {
            const itemCount = Math.min(testItemsCount, fetchedItems.length);
            const items = fetchedItems.slice(0, itemCount);
            log.info(
                `Test mode enabled - processing ${itemCount} items out of ${fetchedItems.length}`
            );
            return items;
        }

        log.info(
            `Fetched ${fetchedItems.length} items from the input dataset.`
        );
        return fetchedItems;
    } catch (error) {
        if (error instanceof Error) {
            log.error(`Error accessing dataset: ${error.message}`);
        } else {
            log.error("Error accessing dataset: Unknown error occurred");
        }
        throw error;
    }
}

async function processItems(
    items: OutputItem[],
    providers: Record<
        string,
        OpenAIProvider | AnthropicProvider | GoogleProvider
    >,
    config: {
        promptChain: PromptChainStep[];
        skipItemIfEmpty: boolean;
        multipleColumns: boolean;
    }
): Promise<void> {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        try {
            // Process each step in the prompt chain
            for (const [stepIndex, step] of config.promptChain.entries()) {
                const stepConfig = {
                    prompt: step.prompt,
                    model: step.model || "gpt-3.5-turbo", // Default model
                    temperature: step.temperature || "0.7", // Default temperature
                    maxTokens: step.maxTokens || 1000, // Default max tokens
                    skipItemIfEmpty: config.skipItemIfEmpty,
                    multipleColumns: config.multipleColumns,
                };

                if (
                    config.skipItemIfEmpty &&
                    hasEmptyFields(stepConfig.prompt, item)
                ) {
                    log.info(`Skipping item ${i + 1} due to empty fields`);
                    continue;
                }

                // Add previous step responses to the item context
                if (stepIndex > 0) {
                    const prevStep = config.promptChain[stepIndex - 1];
                    item[prevStep.responseField] = item.llmresponse;
                }

                const finalPrompt = replacePlaceholders(
                    buildFinalPrompt(
                        stepConfig.prompt,
                        stepConfig.multipleColumns
                    ),
                    item
                );
                log.info(
                    `Processing item ${i + 1}, step ${stepIndex + 1}/${
                        config.promptChain.length
                    }`,
                    {
                        prompt: finalPrompt,
                    }
                );

                const provider = getProvider(stepConfig.model);
                const temperatureNum = parseFloat(stepConfig.temperature);
                item.llmresponse = await providers[provider].call(
                    finalPrompt,
                    stepConfig.model,
                    temperatureNum,
                    stepConfig.maxTokens
                );

                log.info(`Item ${i + 1}, step ${stepIndex + 1} response:`, {
                    response: item.llmresponse,
                });

                await handleItemResponse(
                    item,
                    item.llmresponse,
                    stepConfig.multipleColumns,
                    {
                        provider,
                        model: stepConfig.model,
                        temperature: temperatureNum,
                        maxTokens: stepConfig.maxTokens,
                        providers,
                        finalPrompt,
                    }
                );

                await new Promise((resolve) =>
                    setTimeout(resolve, REQUEST_INTERVAL_MS)
                );
            }
        } catch (error) {
            if (error instanceof Error) {
                log.error(`Error processing item ${i + 1}: ${error.message}`);
            } else {
                log.error(
                    `Error processing item ${i + 1}: Unknown error occurred`
                );
            }
            throw error;
        }
    }
}

async function handleItemResponse(
    item: OutputItem,
    llmresponse: string,
    multipleColumns: boolean,
    config: {
        provider: string;
        model: string;
        temperature: number;
        maxTokens: number;
        providers: Record<
            string,
            OpenAIProvider | AnthropicProvider | GoogleProvider
        >;
        finalPrompt: string;
    }
): Promise<void> {
    if (multipleColumns) {
        let parsedData: any;
        let attemptsLeft = 2;
        let currentResponse = llmresponse;
        let success = false;

        while (attemptsLeft >= 0) {
            try {
                parsedData = JSON.parse(currentResponse);
                success = true;
                break;
            } catch (err) {
                if (attemptsLeft > 0) {
                    log.warning(`Failed to parse JSON. Retrying...`);
                    const retryPrompt = `${config.finalPrompt}\n\nThe last response was not valid JSON. Please return valid JSON this time.`;
                    currentResponse = await config.providers[
                        config.provider
                    ].call(
                        retryPrompt,
                        config.model,
                        config.temperature,
                        config.maxTokens
                    );
                    attemptsLeft--;
                } else {
                    log.error(
                        `Failed to parse JSON after multiple attempts. Using raw response as single column.`
                    );
                    break;
                }
            }
        }

        if (success && typeof parsedData === "object" && parsedData !== null) {
            const outputItem: Record<string, unknown> = { ...item };
            for (const key of Object.keys(parsedData)) {
                outputItem[key] = parsedData[key];
            }
            await Actor.pushData(outputItem);
        } else {
            const fallbackItem = { ...item, llmresponse: currentResponse };
            await Actor.pushData(fallbackItem);
        }
    } else {
        item.llmresponse = llmresponse;
        await Actor.pushData(item);
    }
}

function buildFinalPrompt(
    promptText: string,
    multipleColumns: boolean
): string {
    if (!multipleColumns) {
        return promptText;
    }

    return `${promptText}

Important: Return only a strict JSON object with the requested fields as keys. No extra text or explanations, no markdown, just JSON.`;
}

async function validateJsonFormat(
    testItem: OutputItem,
    config: {
        providers: Record<
            string,
            OpenAIProvider | AnthropicProvider | GoogleProvider
        >;
        model: string;
        temperature: string;
        maxTokens: number;
        prompt: string;
    }
): Promise<boolean> {
    const provider = getProvider(config.model);
    let finalPrompt = replacePlaceholders(
        buildFinalPrompt(config.prompt, true),
        testItem
    );

    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const testResponse = await config.providers[provider].call(
                finalPrompt,
                config.model,
                parseFloat(config.temperature),
                config.maxTokens
            );

            // First check if we got an empty response
            if (!testResponse) {
                log.error("Empty response received from the API");
                await Actor.fail("Empty response received from the API");
                return false;
            }

            // Try parsing as JSON:
            try {
                JSON.parse(testResponse);
                return true; // JSON parsed successfully
            } catch (jsonError) {
                if (attempt < 3) {
                    log.warning(
                        `JSON validation attempt ${attempt} failed. Retrying...`
                    );
                    log.debug("Response that failed JSON parsing:", {
                        response: testResponse,
                    });
                    finalPrompt = `${finalPrompt}\n\nThe last response was not valid JSON. Please return valid JSON this time.`;
                    // Continue to next attempt
                } else {
                    // No attempts left
                    log.error(
                        "JSON validation attempts exhausted. The prompt may not produce valid JSON."
                    );
                    log.debug("Final response that failed JSON parsing:", {
                        response: testResponse,
                    });
                    return false;
                }
            }
        } catch (apiError: any) {
            // Log the full error for debugging
            log.error("API call failed:", {
                error: apiError.message,
                type: apiError.type,
                code: apiError.code,
                param: apiError.param,
            });

            // Rethrow API errors immediately instead of retrying
            throw apiError;
        }
    }
    return false; // Ensure we always return a boolean
}

async function run(): Promise<void> {
    try {
        const validatedInput = await validateInput();

        // Log configuration details
        const configDetails = {
            datasetId: validatedInput.inputDatasetId,
            promptChainLength: validatedInput.promptChain.length,
            multipleColumns: validatedInput.multipleColumns,
        };
        log.info("Configuration details:", configDetails);

        const items = await fetchDatasetItems(
            validatedInput.inputDatasetId,
            validatedInput.testPrompt,
            validatedInput.testItemsCount
        );

        const providers = {
            openai: new OpenAIProvider(validatedInput.llmProviderApiKey),
            anthropic: new AnthropicProvider(validatedInput.llmProviderApiKey),
            google: new GoogleProvider(validatedInput.llmProviderApiKey),
        };

        if (items.length > 0 && validatedInput.multipleColumns) {
            // Use first step's configuration for JSON validation
            const firstStep = validatedInput.promptChain[0];
            const validationResult = await validateJsonFormat(items[0], {
                providers,
                model: firstStep.model || "gpt-3.5-turbo",
                temperature: firstStep.temperature || "0.7",
                maxTokens: firstStep.maxTokens || 1000,
                prompt: firstStep.prompt,
            });

            if (!validationResult) {
                throw new Error(
                    "Failed to produce valid JSON after multiple attempts. Please adjust your prompt or disable multiple columns."
                );
            }
        }

        await processItems(items, providers, {
            promptChain: validatedInput.promptChain,
            skipItemIfEmpty: validatedInput.skipItemIfEmpty,
            multipleColumns: validatedInput.multipleColumns,
        });

        log.info("Actor finished successfully");
        await Actor.exit();
    } catch (error) {
        if (error instanceof Error) {
            log.error("Actor failed:", { error: error.message });
            await Actor.fail(error.message);
        } else {
            log.error("Actor failed with unknown error");
            await Actor.fail("Unknown error occurred");
        }
    }
}

// const { startUrls = ["https://crawlee.dev"], maxRequestsPerCrawl = 100 } =
//     (await Actor.getInput<Input>()) ?? ({} as Input);

// const proxyConfiguration = await Actor.createProxyConfiguration();

// const crawler = new CheerioCrawler({
//     proxyConfiguration,
//     maxRequestsPerCrawl,
//     requestHandler: async ({ enqueueLinks, request, $, log }) => {
//         log.info("enqueueing new URLs");
//         await enqueueLinks();

//         const title = $("title").text();
//         log.info(`${title}`, { url: request.loadedUrl });

//         await Dataset.pushData({ url: request.loadedUrl, title });
//     },
// });

// await crawler.run(startUrls);
await run();
await Actor.exit();
