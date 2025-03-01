import { Run } from "openai/src/resources/beta/threads/runs/runs.js";
import {openai} from "./client.js";


export const runThread = async (thread: any) => {
    let run: Run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: 'asst_YrQpRPrbUPshKNorDV68CGel',
            instructions: "You are a financial assistant. Your input is a JSON object with a scheme involving `news_feed` which gives descriptions about the new. and `insider_feed` which contains the senator members buy and sell history.  Transaction purchase suggests a positive trend. Assess the stock's outlook and summarize the sentiment towards the requested stock ticker. "
        }
    );
    return run;
}

