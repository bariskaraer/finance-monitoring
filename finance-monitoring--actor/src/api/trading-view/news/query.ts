import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';


dotenv.config();

// Initialize the ApifyClient with your Apify API token
// Replace the '<YOUR_API_TOKEN>' with your token
const client = new ApifyClient({
    token: `${process.env.APIFY_API_KEY}`,
});

// Prepare Actor input


export async function fetchTradingViewNews(ticker: any) {
    const input = {
        "symbols": [
            `NASDAQ:${ticker}`
        ],
        "proxy": {
            "useApifyProxy": true,
            "apifyProxyCountry": "US"
        },
        "resultsLimit": 10
    };
    // Run the Actor and wait for it to finish
    const run = await client.actor("mscraper/tradingview-news-scraper").call(input);

// Fetch and print Actor results from the run's dataset (if any)
    console.log('Results from dataset');
    console.log(`💾 Check your data here: https://console.apify.com/storage/datasets/${run.defaultDatasetId}`);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items;
}
