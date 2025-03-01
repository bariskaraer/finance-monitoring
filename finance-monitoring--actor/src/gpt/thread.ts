import {openai} from "./client.js";


export const createThread = async () => {
    return openai.beta.threads.create();
}
