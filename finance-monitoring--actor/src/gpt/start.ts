import {financeAssistant} from "./assistant.js";
import {createThread} from "./thread.js";
import {sendMessage} from "./message.js";
import {runThread} from "./run.js";
import {openai} from "./client.js";
import {sleep} from "openai/core.js";
import {Run} from "openai/resources/beta/threads/index.js";

export const generateResponse = async (newsFeed: any, insiderFeed: any, ticker: any) => {
    const thread = await createThread();
    const input = {
        news_feed: newsFeed,
        insider_feed: insiderFeed,
        ticker: ticker,
    }
    const message = await sendMessage(thread, input);
    const run: Run = await runThread(thread);

    while (run.status === 'in_progress') {
        sleep(1000).then(r => console.log(`${r} sleeping`))
    }
    if (run.status === 'completed') {
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
