import { Run } from "openai/src/resources/beta/threads/runs/runs.js";
import {openai} from "./client.js";


export const runThread = async (thread: any) => {
    let run: Run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: 'asst_PSZGA3uQ2QecNg35iDNL8lmS',
        }
    );
    return run;
}

