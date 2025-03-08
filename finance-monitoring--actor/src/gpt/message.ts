import {openai} from "./client.js";


export const sendMessage = async (thread: any, input: any) => {
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: JSON.stringify(input)
        }
    );
    return message;
}

export const sendStringMessage = async (thread: any, input: string) => {
    const message = await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: input
        }
    );

    return message;
}


