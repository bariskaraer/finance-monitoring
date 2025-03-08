import {createThread} from "./thread.js";
import {sendMessage} from "./message.js";
import {runThread} from "./run.js";
import {openai} from "./client.js";
import {sleep} from "openai/core.js";
import {Run} from "openai/resources/beta/threads/index.js";
import {RequiredActionFunctionToolCall, RunSubmitToolOutputsParams} from "openai/resources/beta/threads/runs/runs.js";

const finalStatuses = ["expired", "completed", "failed", "incomplete", "canceled"]

const assistantInput = "call all available functions to generate the report"

export const generateResponse = async (alphaVantage: any, news: any, filteredCongressTransactions: any, filteredSenateTransactions: any) => {
    const thread = await createThread();

    const message = await sendMessage(thread, assistantInput);
    const run: Run = await runThread(thread);

    while (finalStatuses.filter(value => value === run.status).length !== 0) {
        if(run.status === 'in_progress') {
            sleep(1000).then(r => console.log(`${r} sleeping`))
            continue;
        }
        if(run.status === "requires_action" && run.required_action !== null) {
            const requiredActions = run.required_action.submit_tool_outputs.tool_calls;
            await callTools(thread.id, run.id, requiredActions, alphaVantage, news, filteredCongressTransactions, filteredSenateTransactions)
        }
        const message = await sendMessage(thread, "finalize report. Drop missing fields. Convert output to markdown format");

    }
    if (finalStatuses.filter(value => value === run.status).length !== 0) {
        const messages = await openai.beta.threads.messages.list(
            run.thread_id
        );
        for (const message of messages.data.reverse()) {
            // @ts-ignore
            console.log(`${message.role} > ${message.content[0].text.value}`);
        }
        return messages
    }
    console.log(run.status);
    return "failed";
}


async function callTools(thread_id: string, run_id: string, requiredActions: RequiredActionFunctionToolCall[], alphaVantage: any, news: any, filteredCongressTransactions: any, filteredSenateTransactions: any) {
    const toolOutputs = [];
    for(const requiredAction of requiredActions) {
        const functionName = requiredAction.function.name
        const action_id = requiredAction.id;
        if(functionName === "getCompanyOverview") {
            toolOutputs.push({tool_call_id: action_id, output: alphaVantage.companyOverview})
        }
        if(functionName === "getBalanceSheet") {
            toolOutputs.push({tool_call_id: action_id, output: alphaVantage.balanceSheet})
        }
        if(functionName === "getIncomeStatement") {
            toolOutputs.push({tool_call_id: action_id, output: alphaVantage.incomeStatement})
        }
        if(functionName === "getCashFlow") {
            toolOutputs.push({tool_call_id: action_id, output: alphaVantage.cashFlowStatement})
        }
        if(functionName === "getCompanyInsiderTransactions") {
            toolOutputs.push({tool_call_id: action_id, output: alphaVantage.companyInsiderTransactions})
        }
        if(functionName === "getSenateAndCongressInsiderTransactions") {
            toolOutputs.push({tool_call_id: action_id, output:{filteredSenateTransactions, filteredCongressTransactions}})
        }
        if(functionName === "getNews") {
            toolOutputs.push({tool_call_id: action_id, output:news})
        }
    }
    // @ts-ignore
    const run = await openai.beta.threads.runs.submitToolOutputs(thread_id, run_id, toolOutputs)

    while (finalStatuses.filter(value => value === run.status).length !== 0) {
        if(run.status === 'in_progress') {
            sleep(1000).then(r => console.log(`${r} sleeping`))
        }
    }

    if(run.status !== "completed") {
        throw new Error("run can not be completed" + run.status)
    }

}
