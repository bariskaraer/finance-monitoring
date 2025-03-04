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
                "You are a financial analyst providing insights based on stock data.",
        },
        {
            role: "user",
            content: `Analyze the stock ticker ${stockData.ticker}.`,
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
