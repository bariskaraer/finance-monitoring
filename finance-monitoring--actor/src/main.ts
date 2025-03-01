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

const { startUrls = ["https://crawlee.dev"], maxRequestsPerCrawl = 100 } =
    (await Actor.getInput<Input>()) ?? ({} as Input);

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
await Actor.exit();
