import { Actor, log } from "apify";
import {parallelFetchQuiverQuant} from "./api/quiver-quant/query.js";
import {fetchTradingViewNewsDescriptions} from "./api/trading-view/news/query.js";
import {generateInsiderSection, generateResponse, generateSummaries} from "./gpt/start.js";
import {
    TradingViewNewsArticle, GptNewsSummary, TickerSearchResult
} from "./types.js";
import {fetchTickerSearch, parallelFetchAlphaVantage} from "./api/alpha-vantage/query.js";
import {getInsiderTrading} from "./insider-trading/get-insider-trading.js";
import {isTickerValid} from "./validator/ticker-validator.js";
import { ChargingManager } from './charging-manager.js';
import { pushDataPPEAware } from './push-data-ppe.js';

interface Input {
    ticker: string;
    llmAPIKey: string;
}

export type EventId = 'actor-start-gb' | 'quiver-quant-scraped' | 'alpha-vantage-scraped' | 'trading-view-scraped'| 'openai-llm-process' | 'openai-report-process'

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init()
await Actor.init();
const chargingManager = await ChargingManager.initialize<EventId>();


if ((await chargingManager.chargedEventCount('actor-start-gb') === 0)) {
    const actorRunGBs = Math.ceil((Actor.getEnv().memoryMbytes!) / 1024);
    const actorStartEventsMetadata = Array.from({ length: actorRunGBs }, () => ({}));
    const chargeResultStart = await chargingManager.charge('actor-start-gb', actorStartEventsMetadata);
    console.log('Charge result for actor-start-gb');
    console.dir(chargeResultStart);
}


const { ticker = "AAPL", llmAPIKey = "100" } =
    (await Actor.getInput<Input>()) ?? ({} as Input);
log.setLevel(log.LEVELS.INFO);
log.info("starting");

const tickerSearch: TickerSearchResult = await fetchTickerSearch(ticker);
if(!isTickerValid(ticker, tickerSearch)){
    throw new Error("Ticker is not valid")
}
const alphaVantage = await parallelFetchAlphaVantage(ticker);
const avCharge = await chargingManager.charge('alpha-vantage-scraped', []);
console.log('Charge result for alpha-vantage-scraped');
console.dir(avCharge);

const news: TradingViewNewsArticle[] = await fetchTradingViewNewsDescriptions(ticker);
const newsCharge = await chargingManager.charge('trading-view-scraped', []);
console.log('Charge result for trading-view-scraped');
console.dir(newsCharge);

const summarizedNews: GptNewsSummary = await generateSummaries(news);
const summarizedNewsCharge = await chargingManager.charge('openai-llm-process', []);
console.log('Charge result for openai-llm-process');
console.dir(summarizedNewsCharge);

const quiverQuant = await parallelFetchQuiverQuant(ticker);
const quiverQuantCharge = await chargingManager.charge('quiver-quant-scraped', []);
console.log('Charge result for quiver-quant-scraped');
console.dir(quiverQuantCharge);
log.info("fetched api calls");


const topInsiderTraders = getInsiderTrading(quiverQuant, alphaVantage);
const insiderSection: string = await generateInsiderSection(topInsiderTraders);


const gptResponse: string = await generateResponse(alphaVantage, summarizedNews, insiderSection);
const gptReportCharge = await chargingManager.charge('openai-report-process', []);
console.log('Charge result for openai-report-process');
console.dir(gptReportCharge);

log.info("final response start")
log.info(gptResponse)
log.info("final response end")
await Actor.pushData({ report: gptResponse });

await Actor.exit();