# Finance Monitoring Agent

## Overview

The Finance Monitoring Agent is a comprehensive tool designed to help users monitor financial data and investment sentiments by scraping and analyzing information about publicly traded companies. This agent leverages [Crawlee](https://crawlee.dev/) and [Cheerio](https://cheerio.js.org/) to gather structured insights from specified web sources.

## Included Features

-   **[Apify SDK](https://docs.apify.com/sdk/js)**: Toolkit for building and managing Actors.
-   **[Crawlee](https://crawlee.dev/)**: Web scraping and automation library for seamless data collection.
-   **[Input Schema](https://docs.apify.com/platform/actors/development/input-schema)**: Define and validate schemas for your agent's input effortlessly.
-   **[Dataset](https://docs.apify.com/sdk/python/docs/concepts/storages#working-with-datasets)**: Store structured financial data with consistent attributes.
-   **[Cheerio](https://cheerio.js.org/)**: Fast and elegant library for parsing and manipulating HTML and XML.

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

-   [Video tutorial](https://www.youtube.com/watch?v=yTRHomGg9uQ) on building a scraper using CheerioCrawler.
-   [Written tutorial](https://docs.apify.com/academy/web-scraping-for-beginners/challenge) on auditing and building scrapers.
-   Articles on [scraping dynamic pages](https://blog.apify.com/what-is-a-dynamic-page/) and comparisons between [TypeScript vs. JavaScript](https://blog.apify.com/typescript-vs-javascript-crawler/).
-   Integration guides for [Zapier](https://apify.com/integrations), Google Drive, and others.
-   [Video guide](https://www.youtube.com/watch?v=ViYYDHSBAKM) on accessing scraped data via the Apify API.

## Getting Started

For detailed setup instructions, refer to [this article](https://docs.apify.com/platform/actors/development#build-actor-locally).

To run the agent, use the following command:

```bash
apify run
```

⬇️ Input
The input should include one or multiple stock symbols, market exchanges, and optional data sources. You can provide inputs as single values.

Example input for tracking AAPL and TSLA on the NASDAQ exchange:

```json
{
    "ticker": "AAPL"
}
```

⬆️ Output example
The extracted stock data will be stored as a dataset, viewable in the Output tab. Here’s an example output in MD format:

```md
**Financial Monitoring Report: Apple Inc.**

1. **Company Overview**
   Apple Inc. is a leading entity in the TECHNOLOGY sector, providing consumer electronics, computer software, and online services. It operates across multiple segments and has a significant global presence.

    - **Key Highlights:**
      Market Capitalization: [$3,207.07 billion]
      Global Presence: [Countries Not Provided]
      Core Business Areas: [Hardware, Software, Services]

2. **Industry Analysis**
   Apple Inc. operates within the ELECTRONIC COMPUTERS sector, maintaining a competitive market presence.

    - **Key Metrics:**
      Net Interest Margin (NIM): [Not Provided]
      Return on Assets (ROA): [22.5%]
      Loan Performance:
      Non-Performing Loan (NPL) Ratio: [Not Applicable]
      Regulatory Compliance:
      Common Equity Tier 1 (CET1) Ratio: [Not Applicable]
      Transaction Volume: [$1.5 trillion]

3. **Business Model Assessment**
   Apple Inc. operates through a diversified model focusing on hardware, software, and services.

    - **Key Business Segments:**
        - Hardware: Revenue of [$211 billion], [10%] YoY growth.
        - Software: Assets under management (AUM) of [$300 billion].
        - Services: Revenue contributions of [$60 billion], [15%] YoY growth.

4. **Financial Structure**
   Apple Inc. maintains a solid financial foundation.

    - **Debt & Liquidity Management:**
      Debt-to-Equity Ratio: [0.48]
      Liquidity Coverage Ratio (LCR): [150%]
      Interest Coverage Ratio: [23]

    - **Profitability Metrics:**
      Earnings Per Share (EPS): [$6.30]
      Return on Equity (ROE): [136.5%]
      Operating Efficiency Ratio: [34.5%]

5. **Investor Focus & Stock Market Performance**
   Apple Inc. attracts strong investor interest.

    - **Stock Performance & Valuation:**
      Stock Price: [$239.65]
      Price-to-Earnings (P/E) Ratio: [33.89]
      Dividend Yield: [0.47%]
      Share Buyback Program: [$90 billion]

    - **Market Risks & Trends:**
      Economic Outlook: [High demand for products; potential supply chain issues]
      Recession Risk: [Company well-prepared due to strong cash reserves]
      Technology Expansion: [Investments in AI and software enhancements]

6. **Sentiment Analysis**

    - Overall Sentiment: Neutral

    - **News Summary:**
      Recent media coverage has been classified as Neutral, with key themes including:

        - Apple added nearly 2% in stock value despite delays in AI enhancements for its Siri assistant.
        - The overall markets declined for four consecutive weeks due to concerns over a global trade war.
        - Apple received permits for five iPhone 16 models in Indonesia after a prior sales ban.
        - Discussions between U.K. and U.S. officials focused on Apple's encrypted data access amid privacy concerns.
        - The head of the Siri division criticized the delays in AI enhancements as 'ugly.'
        - Apple is close to resuming iPhone 16 sales in Indonesia after securing permits.
        - Foxconn's CEO noted that U.S. tariffs are causing disruptions for tech companies, including Apple.

    - **Insider Trading:**
      **Overall Sentiment:** [Negative]

-   **Key Findings:**
    -   All top senators are primarily engaged in selling, indicating a bearish outlook.
    -   High trading volume among top stakeholders suggests strong internal confidence in company performance.

### **Top Senators**

| Name                 | Traded Shares | Transactions | Buy/Sell Amount Ratio | Buy/Sell Transactions Ratio |
| -------------------- | ------------- | ------------ | --------------------- | --------------------------- |
| Tommy Tuberville     | 45003         | 3            | 0/45003               | 0/3                         |
| Sheldon Whitehouse   | 15001         | 1            | 0/15001               | 0/1                         |
| Shelley Moore Capito | 5005          | 5            | 0/5005                | 0/5                         |

#### **Summary**

| Metric                      | Value  |
| --------------------------- | ------ |
| Total Purchase Amount       | $0     |
| Total Purchase Transactions | 0      |
| Total Sale Amount           | $65009 |
| Total Sale Transactions     | 9      |

**Sentiment:** Negative

-   **Key Findings:**
    -   All top senators are primarily engaged in selling, indicating a bearish outlook.
    -   Tommy Tuberville has the highest trading activity among them.

### **Top Representatives**

| Name                         | Traded Shares | Transactions | Buy/Sell Amount Ratio | Buy/Sell Transactions Ratio |
| ---------------------------- | ------------- | ------------ | --------------------- | --------------------------- |
| Josh Gottheimer (REP)        | 24010         | 10           | 19005/5005            | 5/5                         |
| Marjorie Taylor Greene (REP) | 3003          | 3            | 3003/0                | 3/0                         |
| Kathy Manning (REP)          | 3003          | 3            | 3003/0                | 3/0                         |

#### **Summary**

| Metric                      | Value    |
| --------------------------- | -------- |
| Total Purchase Amount       | $73017   |
| Total Purchase Transactions | 17       |
| Total Sale Amount           | $5180027 |
| Total Sale Transactions     | 27       |

**Sentiment:** Very Negative

-   **Key Findings:**
    -   Large sales dominated by Nancy Pelosi (over 5 million shares), highlighting significant offloading.
    -   Active trading participation from Josh Gottheimer indicated more bullish buying activity compared to others.

### **Top Stakeholders**

| Name                | Position       | Traded Shares | Transactions | Buy/Sell Amount Ratio | Buy/Sell Transactions Ratio |
| ------------------- | -------------- | ------------- | ------------ | --------------------- | --------------------------- |
| COOK, TIMOTHY D     | Director, CEO  | 2240635       | 15           | 893213/1347422        | 4/11                        |
| MAESTRI, LUCA       | Senior VP, CFO | 765675        | 14           | 284493/481182         | 4/10                        |
| WILLIAMS, JEFFREY E | COO            | 865674        | 16           | 284492/581182         | 3/13                        |

#### **Summary**

| Metric                      | Value    |
| --------------------------- | -------- |
| Total Purchase Amount       | $2078525 |
| Total Purchase Transactions | 34       |
| Total Sale Amount           | $3819980 |
| Total Sale Transactions     | 86       |

**Sentiment:** Neutral

-   **Key Findings:**
    -   High trading volume among top stakeholders, especially purchasing, suggests strong internal confidence in company performance.
    -   Timothy Cook and Luca Maestri exhibit robust trading activity, indicating engagement in company strategy.

## **Overall Summary**

| Category        | Total Purchase Amount | Total Purchase Transactions | Total Sale Amount | Total Sale Transactions | Sentiment     |
| --------------- | --------------------- | --------------------------- | ----------------- | ----------------------- | ------------- |
| Senators        | $0                    | 0                           | $65009            | 9                       | Negative      |
| Representatives | $73017                | 17                          | $5180027          | 27                      | Very Negative |
| Stakeholders    | $2078525              | 34                          | $3819980          | 86                      | Neutral       |
| **Total**       | **$2151542**          | **51**                      | **$9065016**      | **122**                 | **Negative**  |

7. **Summary & Outlook**
   Apple Inc. maintains a **very strong** financial position with **diversified revenue streams** and a **solid capital structure**. The **neutral** sentiment in media and insider trading reflects **internal confidence amid external challenges**.

    - **Key Takeaways from Company Financials:**

        - Gross profit margins remain robust, reflecting operational efficiency.
        - Significant investments in R&D illustrate a commitment to innovation.

    - **Key Takeaways from Recent News:**

        - Apple added nearly 2% in stock value despite delays in AI enhancements for its Siri assistant.
        - Ongoing geopolitical risks and regulatory scrutiny may affect international operations.
        - The company is on track to resume iPhone 16 sales in Indonesia after securing permits.

    - **Notable Insider Trading Activity:**

        - Significant Sale: Tim Cook sold [2,240,635 shares].
        - Significant Purchase: Luca Maestri bought [765,675 shares].
        - Overall Insider Sentiment: Negative

    - **Analyst Expectations:**
      Analysts expect **bullish** performance for the next quarter, based on strong sales forecasts and market conditions.

    - **Key Focus Areas for Next Quarter:**
        - ✅ Enhancing Siri's AI capabilities.
        - ✅ Expanding market presence in Southeast Asia.
        - ✅ Diversifying supply chains to mitigate tariff impacts.
        - ✅ Continued focus on product innovation and service growth.
```
