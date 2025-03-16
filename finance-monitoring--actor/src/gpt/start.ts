import {createThread} from "./thread.js";
import {sendMessage, sendStringMessage} from "./message.js";
import {runInsiderThread, runNewsThread, runThread} from "./run.js";
import {openai} from "./client.js";
import {sleep} from "openai/core.js";
import {Run} from "openai/resources/beta/threads/index.js";
import {RequiredActionFunctionToolCall} from "openai/resources/beta/threads/runs/runs.js";
import {log} from "apify";
import {GptNewsSummary, TradingViewNewsArticle} from "../types.js";

const finalStatuses = ["expired", "completed", "failed", "incomplete", "canceled"]
const SLEEP_IN_MS = 1000;

const assistantInput = "call all available functions to generate the report"

export const generateResponse = async (alphaVantage: any, news: any, topInsiderTraders: any): Promise<string> => {
    const thread = await createThread();

    let message = await sendMessage(thread, assistantInput);
    let run: Run = await runThread(thread);
    log.info("initial run state");
    log.info(JSON.stringify(run.status))
    while (finalStatuses.filter(value => value === run.status).length === 0) {
        if(run.status === 'in_progress') {
            // @ts-ignore
            sleep(SLEEP_IN_MS).then(r => console.log(`${r.status} sleeping`))
            continue;
        }
        if(run.status === "requires_action" && run.required_action !== null) {
            const requiredActions = run.required_action.submit_tool_outputs.tool_calls;
            log.info("inside requires_action")
            run = await callTools(thread.id, run.id, requiredActions, alphaVantage, news, topInsiderTraders)
        }
        log.info("exited function calls")

    }

    run = await runThread(thread);
    log.info(JSON.stringify(run.status))
    message = await sendStringMessage(thread, "finalize report, do not call any additional functions. Only return the final report with markdown format, do not add any other text other than markdown fields.");
    while(finalStatuses.filter(value => value === run.status).length === 0) {
        log.info("finalizing report")
        log.info(run.status)
        if(run.status === 'in_progress') {
            // @ts-ignore
            sleep(SLEEP_IN_MS).then(r => console.log(`${r.status} sleeping`))
        }
    }
    let lastMessage: string = '';
    if(run.status !== "completed") {
        throw new Error(`${run} failed. Unable to generate response`)
    }
    const messages = await openai.beta.threads.messages.list(
        run.thread_id
    );
    for (const message of messages.data.reverse()) {
        // @ts-ignore
        lastMessage = message.content[0].text.value;
        log.info(`${message.role} > ${lastMessage}`);
    }
    // @ts-ignore
    return lastMessage
}


async function callTools(thread_id: string, run_id: string, requiredActions: RequiredActionFunctionToolCall[], alphaVantage: any, news: any, topInsiderTraders: any) {
    const toolOutputs = [];
    for(const requiredAction of requiredActions) {
        const functionName = requiredAction.function.name
        const action_id = requiredAction.id;
        if(functionName === "getCompanyOverview") {
            toolOutputs.push({tool_call_id: action_id, output: JSON.stringify(alphaVantage.companyOverview)})
        }
        if(functionName === "getBalanceSheet") {
            toolOutputs.push({tool_call_id: action_id, output: JSON.stringify(alphaVantage.balanceSheet)})
        }
        if(functionName === "getIncomeStatement") {
            toolOutputs.push({tool_call_id: action_id, output: JSON.stringify(alphaVantage.incomeStatement)})
        }
        if(functionName === "getCashFlow") {
            toolOutputs.push({tool_call_id: action_id, output: JSON.stringify(alphaVantage.cashFlowStatement)})
        }
        if(functionName === "getInsiderTransactions") {
            toolOutputs.push({tool_call_id: action_id, output: topInsiderTraders})
        }
        if(functionName === "getNews") {
            toolOutputs.push({tool_call_id: action_id, output: JSON.stringify(news)})
        }
    }
    // @ts-ignore
    //log.info(JSON.stringify(toolOutputs))
    const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(thread_id, run_id, {tool_outputs: toolOutputs})
    log.info("status after submit tool outputs")
    log.info(run.status)
    //log.info(run.status)
    while (finalStatuses.filter(value => value === run.status).length === 0) {
        log.info(run.status)
        if(run.status === 'in_progress' || run.status === "queued") {
            // @ts-ignore
            sleep(SLEEP_IN_MS).then(r => log.info(`${r.status} sleeping`))
        }
    }

    if(run.status !== "completed") {
        throw new Error("run can not be completed" + run.status)
    }

    return run;

}


export const generateSummaries = async (news: TradingViewNewsArticle[]): Promise<GptNewsSummary> => {
    const thread = await createThread();
    const mappedNews = news.map(value => {
        const news :TradingViewNewsArticle = value;
        return {
            descriptionText: news.descriptionText,
            title: news.title
        }
    })
    const message = await sendMessage(thread, mappedNews);
    let run: Run = await runNewsThread(thread);

    while (finalStatuses.filter(value => value === run.status).length === 0) {
        if(run.status === 'in_progress' || run.status === "queued") {
            sleep(SLEEP_IN_MS).then(r => log.info(`${r} sleeping`))
        }
    }
    if(run.status !== "completed") {
        throw new Error("cannot generate summaries")
    }
    const messages = await openai.beta.threads.messages.list(
        run.thread_id
    );
    // @ts-ignore
    return JSON.parse(messages.data[0].content[0].text.value);
}

export const generateInsiderSection = async (insiderTransactions: any): Promise<string> => {
    const thread = await createThread();


    const message = await sendMessage(thread, insiderTransactions);
    let run: Run = await runInsiderThread(thread);

    while (finalStatuses.filter(value => value === run.status).length === 0) {
        if(run.status === 'in_progress' || run.status === "queued") {
            sleep(SLEEP_IN_MS).then(r => log.info(`${r} sleeping`))
        }
    }
    if(run.status !== "completed") {
        throw new Error("cannot generate summaries")
    }
    const messages = await openai.beta.threads.messages.list(
        run.thread_id
    );
    // @ts-ignore
    return messages.data[0].content[0].text.value;
}
