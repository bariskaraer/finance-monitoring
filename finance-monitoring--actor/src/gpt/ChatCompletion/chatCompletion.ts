import { OpenAI } from "openai";
import { StockData } from "../../types.js";

type Message = { role: "system" | "user" | "assistant"; content: string };

const openai = new OpenAI({
    apiKey: `${process.env.OPENAPI_API_KEY}`,
});

export async function getStockAssessment(stockData: StockData) {
    const messages: Message[] = [
        {
            role: "system",
            content:
                `You are a financial assistant. Your input is a JSON object with a scheme involving news_feed which gives descriptions about the news and insider_feed which contains the senator members buy and sell history.  
                Transaction purchase suggests a positive trend. Assess the stock's outlook and summarize the sentiment towards the requested stock ticker.
                Prioritize the fields AnalystRatingStrongBuy, AnalystRatingBuy, AnalystRatingHold, AnalystRatingSell, AnalystRatingStrongSell when making decisions. 
                Provide a structured JSON response following this format: 
                {
                stock_ticker: string;
                analysis: {
                    news_sentiment: {
                    sentiment: string;
                    reasoning: string;
                    };
                    insider_sentiment: {
                    sentiment: string;
                    reasoning: string;
                    };
                    technical_evaluation: {
                    trend: string;
                    reasoning: string;
                    };
                    overall_evaluation: {
                    verdict: string;
                    reasoning: string;
                    };
                };
                }
                `,
        },
        {
            role: "user",
            content: `Analyze the stock ticker ${stockData.ticker}. Here is the company overview for you to start: \n\`\`\`json\n${JSON.stringify(stockData.overview, null, 2)}\n\`\`\``,
        },
    ];

    const insiderSenatorTransactions = stockData.senatorTransactions.map(
        (tx) =>
            `Senate Insider: ${tx.Senator}  ${tx.Transaction}: (${tx.Amount}) Dollars on ${tx.Date}.`
    );
    messages.push({ role: "user", content: insiderSenatorTransactions.join(" \n") });

    const insiderCongressTransactions = stockData.congressTransactions.map(
        (tx) =>
            `Congress Insider: ${tx.Representative}  ${tx.Transaction}: (${tx.Amount}) Dollars on ${tx.TransactionDate}.`
    );
    messages.push({ role: "user", content: insiderCongressTransactions.join(" \n") });

    const newsSummaries = stockData.news.map(
        (news) =>
            `News: ${news.provider} - ${news.source}: ${news.shortDescription} (Full news description: ${news.descriptionText}).`
    );
    messages.push({ role: "user", content: newsSummaries.join(" \n") });

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        max_tokens: 500,
    });

    console.log(response.choices[0].message.content);
}

