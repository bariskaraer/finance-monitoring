import { ApifyClient } from "apify-client";
import dotenv from "dotenv";
import {NewsArticle, TradingViewNewsArticle} from "../../../types.js";
import { insertNewsArticle, searchTickerNews } from "../../../pinecone/client.js";
import {log} from "apify";

dotenv.config();

// Initialize the ApifyClient with your Apify API token
// Replace the '<YOUR_API_TOKEN>' with your token
const client = new ApifyClient({
    token: `${process.env.APIFY_API_KEY}`,
});

// Prepare Actor input

export async function fetchTradingViewNews(
    ticker: any
): Promise<NewsArticle[]> {
    const input = {
        symbols: [`NASDAQ:${ticker}`],
        proxy: {
            useApifyProxy: true,
            apifyProxyCountry: "US",
        },
        resultsLimit: 10,
    };
    const run = await client
        .actor("mscraper/tradingview-news-scraper")
        .call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    for (const item of items) {
        const newsItem = {
            source: String(item.source),
            descriptionText: String(item.descriptionText),
            publishDate: Number(item.publishDate),
            score: Number(item.score)
        };

        // Insert news to PINECONE
        await insertNewsArticle(newsItem, ticker);
    }

    const pcResult = await searchTickerNews(`Latest ${ticker} stock news impacting price trends, investor sentiment, and major financial events in the past quarter.`, 5, ticker);
    return pcResult;
}


export async function fetchTradingViewNewsDescriptions(
    ticker: any
): Promise<TradingViewNewsArticle[]> {
    const input = {
        symbols: [`NASDAQ:${ticker}`],
        proxy: {
            useApifyProxy: true,
            apifyProxyCountry: "US",
        },
        resultsLimit: 10,
    };
    const run = await client
        .actor("mscraper/tradingview-news-scraper")
        .call(input);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const news: TradingViewNewsArticle[] = []
    for (const item of items) {
        const tradingViewNewsItem: TradingViewNewsArticle = {
            source: String(item.source),
            descriptionText: String(item.descriptionText),
            publishDate: String(item.publishDate),
            title: String(item.title)
        }
        news.push(tradingViewNewsItem)
    }
    return news
}
