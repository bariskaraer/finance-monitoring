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

export const runNewsThread = async (thread: any) => {
    let run: Run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: 'asst_VLor5jtjUY20Ijd5SKiulD8V',
        }
    );
    return run;
}

export const runInsiderThread = async (thread: any) => {
    let run: Run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
            assistant_id: 'asst_3STCyKsz1ENk9AqnTMN2ZBXR',
        }
    );
    return run;
}

