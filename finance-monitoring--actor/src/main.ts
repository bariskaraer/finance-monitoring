import { Actor, log } from "apify";
import {parallelFetchQuiverQuant} from "./api/quiver-quant/query.js";
import {fetchTradingViewNewsDescriptions} from "./api/trading-view/news/query.js";
import {generateInsiderSection, generateResponse, generateSummaries} from "./gpt/start.js";
import {
    TradingViewNewsArticle, GptNewsSummary
} from "./types.js";
import {parallelFetchAlphaVantage} from "./api/alpha-vantage/query.js";
import {getInsiderTrading} from "./insider-trading/get-insider-trading.js";

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
log.setLevel(log.LEVELS.INFO);
log.info("starting");


// Filter between dates (inclusive)
const today = new Date();
const pastYearDate = new Date();
pastYearDate.setFullYear(today.getFullYear() - 1);

const alphaVantage = await parallelFetchAlphaVantage(ticker);
const news: TradingViewNewsArticle[] = await fetchTradingViewNewsDescriptions(ticker);
const summarizedNews: GptNewsSummary = await generateSummaries(news);
const quiverQuant = await parallelFetchQuiverQuant(ticker);
log.info("fetched api calls");


const topInsiderTraders = getInsiderTrading(quiverQuant, alphaVantage);
const insiderSection = await generateInsiderSection(topInsiderTraders);


const gptResponse = await generateResponse(alphaVantage, summarizedNews, insiderSection);
log.info("final response start")
log.info(JSON.stringify(gptResponse))
log.info("final response end")
await Actor.pushData({ report: gptResponse });

await Actor.exit();

// await Dataset.pushData({ url: request.loadedUrl, title });
