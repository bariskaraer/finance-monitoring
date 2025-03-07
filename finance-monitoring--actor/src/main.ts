import { Actor, log } from "apify";
import { fetchCongressTrading, fetchSenateTrading } from "./api/quiver-quant/query.js";
import { fetchTradingViewNews } from "./api/trading-view/news/query.js";
import { generateResponse } from "./gpt/start.js";
import { getStockAssessment } from "./gpt/ChatCompletion/chatCompletion.js";
import { SenatorTransaction, NewsArticle, CompanyOverview, CongressTransaction } from "./types.js";
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

const { ticker = "COST", llmAPIKey = "100" } =
    (await Actor.getInput<Input>()) ?? ({} as Input);


const companyOverview: CompanyOverview = await fetchCompanyOverview(ticker);
log.debug('Company Overview scraped');
const senatorTrading: SenatorTransaction[] = await fetchSenateTrading(ticker);
log.debug('Senator Trading scraped');
const congressTrading: CongressTransaction[] = await fetchCongressTrading(ticker);
log.debug('Congress Trading scraped');
const news: NewsArticle[] = await fetchTradingViewNews(ticker);
log.debug('News scraped');



// Filter between dates (inclusive)
const today = new Date();
const pastYearDate = new Date();
pastYearDate.setFullYear(today.getFullYear() - 1);

const filteredSenateTransactions = senatorTrading.filter(transaction => {
  const transactionDate = new Date(transaction.Date);
  return transactionDate >= pastYearDate && transactionDate <= today;
});

const filteredCongressTransactions = congressTrading.filter(transaction => {
    const transactionDate = new Date(transaction.TransactionDate);
    return transactionDate >= pastYearDate && transactionDate <= today;
  });

//const gptResponse = await generateResponse(senatorTrading, news, ticker);
console.log("-------------------------");
//console.log(JSON.stringify(gptResponse));
console.log("-------------------------");

const chatCompletionResponse = await getStockAssessment({
    overview: companyOverview,
    ticker: ticker,
    senatorTransactions: filteredSenateTransactions,
    congressTransactions: filteredCongressTransactions,
    news: news
});
console.log(JSON.stringify(news));
console.log(JSON.stringify(chatCompletionResponse));
await Actor.pushData({ ChatCompletionResponse: chatCompletionResponse });

await Actor.exit();

// await Dataset.pushData({ url: request.loadedUrl, title });
