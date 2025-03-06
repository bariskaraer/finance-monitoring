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
                `Analyze the JSON object input to assess the sentiment and outlook of a specific stock ticker, using the 'news_feed' for news descriptions and 'insider_feed' for senator buy and sell history. Prioritize Analyst Ratings in your sentiment analysis. 
Apply the following criteria to derive your analysis:
- Transaction purchases indicate a positive trend.
- Consideration of news sentiment involves gauging the overall positive or negative tone of the news articles relevant to the stock.
- Insider sentiment involves assessing the buy and sell behaviors of insiders. Purchases are generally seen as a positive indicator.
- Technical evaluation consists of current stock trends using given Analyst Ratings.
- Overall evaluation aggregates the assessments to provide a final sentiment verdict on the stock.
# Steps
1. **News Sentiment Analysis:**
   - Review the 'news_feed' to identify positive or negative sentiments regarding the stock.
   - Document reasoning for sentiment.
2. **Insider Sentiment Analysis:**
   - Evaluate 'insider_feed' for any recent purchase or sale by insiders.
   - Document reasoning for sentiment, emphasizing purchase activities.
3. **Technical Evaluation:**
   - Use Analyst Ratings ('StrongBuy', 'Buy', 'Hold', 'Sell', 'StrongSell') to evaluate the stock's technical position.
   - Document reasoning based on rating priority.
4. **Overall Evaluation:**
   - Combine insights from news sentiment, insider sentiment, and technical evaluation.
   - Formulate an overall verdict and provide comprehensive reasoning.
# Output Format
The output should be a Markdown free text that has headers and related paragraphs
# Notes
- Prioritize strong buy and buy ratings while considering hold and sell ratings in the technical evaluation.
- While forming conclusions, consider both qualitative and quantitative data from the input.
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
        model: "gpt-4o-mini",
        messages,
        max_tokens: 16000,
        temperature: 0.25
    });

    return response.choices[0].message.content;
}

