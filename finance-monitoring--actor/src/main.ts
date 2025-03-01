import { Actor, log } from "apify";
import {fetchCongressTrading} from './api/quiver-quant/query.js';
import {fetchTradingViewNews} from './api/trading-view/news/query.js';
import {generateResponse} from "./gpt/start.js";


// interface Input {
//     startUrls: string[];
//     maxRequestsPerCrawl: number;
// }

// Rate limits for OpenAI API lowest tier
const RATE_LIMIT_PER_MINUTE = 500;
const REQUEST_INTERVAL_MS = Math.ceil(60000 / RATE_LIMIT_PER_MINUTE); // Interval between requests in ms

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();

// const { startUrls = ["https://crawlee.dev"], maxRequestsPerCrawl = 100 } =
//     (await Actor.getInput<Input>()) ?? ({} as Input);
const ticker = 'AAPL';
const data = await fetchCongressTrading(ticker);
const news = await fetchTradingViewNews(ticker);
// console.log("-------------------------")
// // console.log(news)
// console.log("-------------------------")
// console.log(data)
// console.log("-------------------------")
const gptResponse = await generateResponse(
    data,
    news, ticker)
console.log("-------------------------")
console.log(JSON.stringify(gptResponse))
console.log("-------------------------")

await Actor.exit();


// await Dataset.pushData({ url: request.loadedUrl, title });
