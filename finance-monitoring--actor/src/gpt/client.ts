import OpenAI from "openai";


import dotenv from "dotenv";
dotenv.config();

export const openai = new OpenAI({
    organization: `${process.env.OPENAPI_ORG_KEY}`,
    project: `${process.env.OPENAPI_PROJECT_KEY}`,
});
