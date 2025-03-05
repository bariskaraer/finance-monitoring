import { Actor, log } from "apify";
import { fetchSenateTrading } from "./api/quiver-quant/query.js";
import { fetchTradingViewNews } from "./api/trading-view/news/query.js";
import { generateResponse } from "./gpt/start.js";
import { getStockAssessment } from "./gpt/ChatCompletion/chatCompletion.js";
import { SenatorTransaction, NewsArticle } from "./types.js";
import { fetchCompanyOverview } from "./api/alpha-vantage/query.js";

interface Input {
    ticker: string;
    llmAPIKey: string;
}

// Rate limits for OpenAI API lowest tier
const RATE_LIMIT_PER_MINUTE = 500;
const REQUEST_INTERVAL_MS = Math.ceil(60000 / RATE_LIMIT_PER_MINUTE); // Interval between requests in ms

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

const { ticker = "AAPL", llmAPIKey = "100" } =
    (await Actor.getInput<Input>()) ?? ({} as Input);


const companyOverview = fetchCompanyOverview(ticker);

const senatorTrading: SenatorTransaction[] = await fetchSenateTrading(ticker);
// Filter between dates (inclusive)
const today = new Date();
const pastYearDate = new Date();
pastYearDate.setFullYear(today.getFullYear() - 1);

const filteredTransactions = senatorTrading.filter(transaction => {
  const transactionDate = new Date(transaction.Date);
  return transactionDate >= pastYearDate && transactionDate <= today;
});

const news: NewsArticle[] = await fetchTradingViewNews(ticker);
// // console.log(news)
// console.log("-------------------------")
// console.log(data)
// console.log("-------------------------")
//const gptResponse = await generateResponse(senatorTrading, news, ticker);
console.log("-------------------------");
//console.log(JSON.stringify(gptResponse));
console.log("-------------------------");

const chatCompletionResponse = await getStockAssessment({
    ticker: "AAPL",
    senatorTransactions: filteredTransactions,
    news: news,
    priceHistory: [],
});

await Actor.exit();

// await Dataset.pushData({ url: request.loadedUrl, title });
