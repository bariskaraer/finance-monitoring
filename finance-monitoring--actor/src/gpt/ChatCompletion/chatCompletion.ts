import { OpenAI } from "openai";
import { StockData } from "../../types.js";

type Message = { role: "system" | "user" | "assistant"; content: string };

const openai = new OpenAI({
    apiKey: `${process.env.OPENAPI_API_KEY}`, // Replace with your actual API key
});

export async function getStockAssessment(stockData: StockData) {
    const messages: Message[] = [
        {
            role: "system",
            content:
                "You are a financial assistant. Your input is a JSON object with a scheme involving news_feed which gives descriptions about the new. and insider_feed which contains the senator members buy and sell history.  Transaction purchase suggests a positive trend. Assess the stock's outlook and summarize the sentiment towards the requested stock ticker.",
        },
        {
            role: "user",
            content: `Analyze the stock ticker ${stockData.ticker}. Here is the company overview for you to start: \n\`\`\`json\n${JSON.stringify(stockData.overview, null, 2)}\n\`\`\``,
        },
    ];

    const insiderTransactions = stockData.senatorTransactions.map(
        (tx) =>
            `Insider: ${tx.Senator}  ${tx.Transaction}: (${tx.Amount}) Dollars on ${tx.Date}.`
    );
    messages.push({ role: "user", content: insiderTransactions.join(" \n") });

    const newsSummaries = stockData.news.map(
        (news) =>
            `News: ${news.provider} - ${news.source}: ${news.shortDescription} (Full news description: ${news.descriptionText}).`
    );
    messages.push({ role: "user", content: newsSummaries.join(" \n") });

    // const priceSummaries = stockData.priceData.map(
    //     (price) =>
    //         `Price Data: ${price.date}: Open $${price.open}, Close $${price.close}, High $${price.high}, Low $${price.low}, Volume ${price.volume}.`
    // );
    // messages.push({ role: "user", content: priceSummaries.join(" \n") });

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        max_tokens: 500,
    });

    console.log(response.choices[0].message.content);
}

// getStockAssessment("Tell me a fun fact about space.");
