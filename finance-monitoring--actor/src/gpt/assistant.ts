import {openai} from "./client.js";

export const financeAssistant = await openai.beta.assistants.retrieve(
    "asst_YrQpRPrbUPshKNorDV68CGel"
);
