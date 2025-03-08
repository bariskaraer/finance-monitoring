import { Actor, log } from "apify";
import {fetchCongressTrading, fetchSenateTrading, parallelFetchQuiverQuant} from "./api/quiver-quant/query.js";
import {fetchTradingViewNews, fetchTradingViewNewsDescriptions} from "./api/trading-view/news/query.js";
import { generateResponse } from "./gpt/start.js";
import { getStockAssessment } from "./gpt/ChatCompletion/chatCompletion.js";
import { SenatorTransaction, NewsArticle, CompanyOverview, CongressTransaction } from "./types.js";
import {fetchCompanyOverview, parallelFetchAlphaVantage} from "./api/alpha-vantage/query.js";

interface Input {
    ticker: string;
    llmAPIKey: string;
}

// Rate limits for OpenAI API lowest tier
const RATE_LIMIT_PER_MINUTE = 500;
const REQUEST_INTERVAL_MS = Math.ceil(60000 / RATE_LIMIT_PER_MINUTE); // Interval between requests in ms

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// Burada time horizon da olmalı in days belki
const { ticker = "AAPL", llmAPIKey = "100" } =
    (await Actor.getInput<Input>()) ?? ({} as Input);





// Filter between dates (inclusive)
const today = new Date();
const pastYearDate = new Date();
pastYearDate.setFullYear(today.getFullYear() - 1);

const alphaVantage = await parallelFetchAlphaVantage(ticker);
const news = await fetchTradingViewNewsDescriptions(ticker);
const quiverQuant = await parallelFetchQuiverQuant(ticker);

const filteredSenateTransactions = quiverQuant.senateTrading.filter(transaction => {
  const transactionDate = new Date(transaction.Date);
  return transactionDate >= pastYearDate && transactionDate <= today;
});

const filteredCongressTransactions = quiverQuant.congressTrading.filter(transaction => {
    const transactionDate = new Date(transaction.TransactionDate);
    return transactionDate >= pastYearDate && transactionDate <= today;
  });

const apiResponses = {alphaVantage, news, filteredCongressTransactions, filteredSenateTransactions}
const gptResponse = generateResponse(alphaVantage, news, filteredCongressTransactions, filteredSenateTransactions);
await Actor.pushData({ report: gptResponse });

await Actor.exit();

// await Dataset.pushData({ url: request.loadedUrl, title });
