export interface PromptChainStep {
    prompt: string;
    model?: string;
    temperature?: string;
    maxTokens?: number;
    responseField: string;
}

export interface Input {
    inputDatasetId: string;
    defaultDatasetId: string;
    llmProviderApiKey: string;
    promptChain: PromptChainStep[];
    skipItemIfEmpty?: boolean;
    multipleColumns?: boolean;
    testPrompt?: boolean;
    testItemsCount?: number;
    payload: Payload | null;
}

export interface Payload {
    resource: Resource;
}

export interface Resource {
    defaultDatasetId: string;
}

export interface OutputItem extends Record<string, any> {
    LLMResponse: string | null;
}

export interface LLMProvider {
    call(
        promptText: string,
        model: string,
        temperature: number,
        maxTokens: number
    ): Promise<string>;
}

// QUIVERQUANT
export interface SenatorTransaction {
    Senator: string;
    BioGuideID: string;
    Date: string; // ISO date format (YYYY-MM-DD)
    Ticker: string;
    Transaction: string;
    Range: string;
    Amount: string; // Could be number if you'll convert it to float
    last_modified: string; // ISO date format (YYYY-MM-DD)
}

export interface CongressTransaction {
    Representative: string;
    ReportDate: string; // Can be changed to Date if needed
    TransactionDate: string;
    Ticker: string;
    Transaction: string;
    Range: string;
    District: string;
    House: string;
    Amount: number;
    Party: string;
    TickerType: string;
    Description: string;
    ExcessReturn: number;
    PriceChange: number;
    SPYChange: number;
    last_modified: null | string; // Assuming it might be a string in the future
}

// TradingView News
export interface RelatedSymbol {
    symbol: string;
    logoid: string;
    logourl: string;
}

export interface AstDescriptionChild {
    type: string;
    children: string[];
}

export interface AstDescription {
    type: string;
    children: AstDescriptionChild[];
}

export interface NewsArticle {
    provider: string;
    source: string;
    descriptionText: string;
    shortDescription: string;
}

export interface PriceData {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface StockData {
    overview: CompanyOverview;
    ticker: string;
    senatorTransactions: SenatorTransaction[];
    congressTransactions: CongressTransaction[];
    news: NewsArticle[];
}

export interface CompanyOverview {
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    CIK: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    Address: string;
    OfficialSite: string;
    FiscalYearEnd: string;
    LatestQuarter: string;
    MarketCapitalization: string;
    EBITDA: string;
    PERatio: string;
    PEGRatio: string;
    BookValue: string;
    DividendPerShare: string;
    DividendYield: string;
    EPS: string;
    RevenuePerShareTTM: string;
    ProfitMargin: string;
    OperatingMarginTTM: string;
    ReturnOnAssetsTTM: string;
    ReturnOnEquityTTM: string;
    RevenueTTM: string;
    GrossProfitTTM: string;
    DilutedEPSTTM: string;
    QuarterlyEarningsGrowthYOY: string;
    QuarterlyRevenueGrowthYOY: string;
    AnalystTargetPrice: string;
    AnalystRatingStrongBuy: string;
    AnalystRatingBuy: string;
    AnalystRatingHold: string;
    AnalystRatingSell: string;
    AnalystRatingStrongSell: string;
    TrailingPE: string;
    ForwardPE: string;
    PriceToSalesRatioTTM: string;
    PriceToBookRatio: string;
    EVToRevenue: string;
    EVToEBITDA: string;
    Beta: string;
    "52WeekHigh": string;
    "52WeekLow": string;
    "50DayMovingAverage": string;
    "200DayMovingAverage": string;
    SharesOutstanding: string;
    DividendDate: string;
    ExDividendDate: string;
  }
  
