# Finance Monitoring Agent

## Overview

The Finance Monitoring Agent is a comprehensive tool designed to help users monitor financial data and investment sentiments by scraping and analyzing information about publicly traded companies. This agent leverages [Crawlee](https://crawlee.dev/) and [Cheerio](https://cheerio.js.org/) to gather structured insights from specified web sources.

## Included Features

- **[Apify SDK](https://docs.apify.com/sdk/js)**: Toolkit for building and managing Actors.
- **[Crawlee](https://crawlee.dev/)**: Web scraping and automation library for seamless data collection.
- **[Input Schema](https://docs.apify.com/platform/actors/development/input-schema)**: Define and validate schemas for your agent's input effortlessly.
- **[Dataset](https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-datasets)**: Store structured financial data with consistent attributes.
- **[Cheerio](https://cheerio.js.org/)**: Fast and elegant library for parsing and manipulating HTML and XML.

## How It Works

This TypeScript script utilizes the Crawlee CheerioCrawler framework to scrape important financial data and investor sentiment. The agent returns a detailed financial report, which includes:

1. **Company Overview**: Key metrics about the company.
2. **Industry Analysis**: Insights into the company's market position and financial metrics.
3. **Business Model Assessment**: Evaluation of the company's revenue streams and business segments.
4. **Financial Structure**: Key financial indicators such as debt, profitability metrics, and liquidity management.
5. **Investor Focus & Stock Market Performance**: Analysis of stock performance, market risks, and investor sentiment.
6. **Sentiment Analysis**: Insights into investor and insider trading sentiment based on recent activities.

The agent starts by pulling URLs provided in the `startUrls` field from the input schema and is limited by the `maxPagesPerCrawl` parameter. Each URL is processed through a `requestHandler` which extracts the relevant data and stores it in the dataset while logging each action.

## Resources

- [Video tutorial](https://www.youtube.com/watch?v=yTRHomGg9uQ) on building a scraper using CheerioCrawler.
- [Written tutorial](https://docs.apify.com/academy/web-scraping-for-beginners/challenge) on auditing and building scrapers.
- Articles on [scraping dynamic pages](https://blog.apify.com/what-is-a-dynamic-page/) and comparisons between [TypeScript vs. JavaScript](https://blog.apify.com/typescript-vs-javascript-crawler/).
- Integration guides for [Zapier](https://apify.com/integrations), Google Drive, and others.
- [Video guide](https://www.youtube.com/watch?v=ViYYDHSBAKM) on accessing scraped data via the Apify API.

## Getting Started

For detailed setup instructions, refer to [this article](https://docs.apify.com/platform/actors/development#build-actor-locally).

To run the agent, use the following command:

```bash
apify run
