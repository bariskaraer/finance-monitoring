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
    source: string;
    descriptionText: string;
    publishDate: Number;
    score: Number;
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


export interface AnnualReport {
    fiscalDateEnding: string; // Date in YYYY-MM-DD format
    reportedCurrency: string; // Currency, e.g., "USD"
    grossProfit: string; // Amount in string
    totalRevenue: string; // Amount in string
    costOfRevenue: string; // Amount in string
    costofGoodsAndServicesSold: string; // Amount in string
    operatingIncome: string; // Amount in string
    sellingGeneralAndAdministrative: string; // Amount in string
    researchAndDevelopment: string; // Amount in string
    operatingExpenses: string; // Amount in string
    investmentIncomeNet: string; // Amount in string or "None"
    netInterestIncome: string; // Amount in string
    interestIncome: string; // Amount in string
    interestExpense: string; // Amount in string
    nonInterestIncome: string; // Amount in string
    otherNonOperatingIncome: string; // Amount in string
    depreciation: string; // Amount in string
    depreciationAndAmortization: string; // Amount in string
    incomeBeforeTax: string; // Amount in string
    incomeTaxExpense: string; // Amount in string
    interestAndDebtExpense: string; // Amount in string or "None"
    netIncomeFromContinuingOperations: string; // Amount in string
    comprehensiveIncomeNetOfTax: string; // Amount in string
    ebit: string; // Amount in string
    ebitda: string; // Amount in string
    netIncome: string; // Amount in string
}

export interface CompanyFinancials {
    symbol: string; // Company symbol, e.g., "IBM"
    annualReports: AnnualReport[]; // Array of annual reports
}


export interface BalanceSheetAnnualReport {
    fiscalDateEnding: string; // Date in YYYY-MM-DD format
    reportedCurrency: string; // Currency, e.g., "USD"
    totalAssets: string; // Amount in string
    totalCurrentAssets: string; // Amount in string
    cashAndCashEquivalentsAtCarryingValue: string; // Amount in string
    cashAndShortTermInvestments: string; // Amount in string
    inventory: string; // Amount in string
    currentNetReceivables: string; // Amount in string
    totalNonCurrentAssets: string; // Amount in string
    propertyPlantEquipment: string; // Amount in string
    accumulatedDepreciationAmortizationPPE: string; // Amount in string or "None"
    intangibleAssets: string; // Amount in string
    intangibleAssetsExcludingGoodwill: string; // Amount in string
    goodwill: string; // Amount in string
    investments: string; // Amount in string
    longTermInvestments: string; // Amount in string
    shortTermInvestments: string; // Amount in string or "None"
    otherCurrentAssets: string; // Amount in string or "None"
    otherNonCurrentAssets: string; // Amount in string or "None"
    totalLiabilities: string; // Amount in string
    totalCurrentLiabilities: string; // Amount in string
    currentAccountsPayable: string; // Amount in string
    deferredRevenue: string; // Amount in string
    currentDebt: string; // Amount in string
    shortTermDebt: string; // Amount in string
    totalNonCurrentLiabilities: string; // Amount in string
    capitalLeaseObligations: string; // Amount in string
    longTermDebt: string; // Amount in string
    currentLongTermDebt: string; // Amount in string
    longTermDebtNoncurrent: string; // Amount in string
    shortLongTermDebtTotal: string; // Amount in string
    otherCurrentLiabilities: string; // Amount in string or "None"
    otherNonCurrentLiabilities: string; // Amount in string
    totalShareholderEquity: string; // Amount in string
    treasuryStock: string; // Amount in string
    retainedEarnings: string; // Amount in string
    commonStock: string; // Amount in string or "None"
    commonStockSharesOutstanding: string; // Amount in string
}

export interface CompanyBalanceSheet {
    symbol: string; // Company symbol, e.g., "IBM"
    annualReports: BalanceSheetAnnualReport[]; // Array of annual reports
}


export interface AnnualCashFlowReport {
    fiscalDateEnding: string; // Date in YYYY-MM-DD format
    reportedCurrency: string; // Currency, e.g., "USD"
    operatingCashflow: string; // Amount in string
    paymentsForOperatingActivities: string; // Amount in string
    proceedsFromOperatingActivities: string; // Amount in string or "None"
    changeInOperatingLiabilities: string; // Amount in string
    changeInOperatingAssets: string; // Amount in string
    depreciationDepletionAndAmortization: string; // Amount in string
    capitalExpenditures: string; // Amount in string
    changeInReceivables: string; // Amount in string
    changeInInventory: string; // Amount in string
    profitLoss: string; // Amount in string
    cashflowFromInvestment: string; // Amount in string
    cashflowFromFinancing: string; // Amount in string
    proceedsFromRepaymentsOfShortTermDebt: string; // Amount in string
    paymentsForRepurchaseOfCommonStock: string; // Amount in string or "None"
    paymentsForRepurchaseOfEquity: string; // Amount in string or "None"
    paymentsForRepurchaseOfPreferredStock: string; // Amount in string or "None"
    dividendPayout: string; // Amount in string
    dividendPayoutCommonStock: string; // Amount in string
    dividendPayoutPreferredStock: string; // Amount in string or "None"
    proceedsFromIssuanceOfCommonStock: string; // Amount in string or "None"
    proceedsFromIssuanceOfLongTermDebtAndCapitalSecuritiesNet: string; // Amount in string
    proceedsFromIssuanceOfPreferredStock: string; // Amount in string or "None"
    proceedsFromRepurchaseOfEquity: string; // Amount in string
    proceedsFromSaleOfTreasuryStock: string; // Amount in string or "None"
    changeInCashAndCashEquivalents: string; // Amount in string or "None"
    changeInExchangeRate: string; // Amount in string or "None"
    netIncome: string; // Amount in string
}

export interface CompanyCashFlowStatement {
    symbol: string; // Company symbol, e.g., "IBM"
    annualReports: AnnualCashFlowReport[]; // Array of annual cash flow reports
}


export interface CompanyInsiderTransaction {
    transaction_date: string; // Date in YYYY-MM-DD format
    ticker: string; // Stock ticker symbol, e.g., "IBM"
    executive: string; // Name of the executive
    executive_title: string; // Title of the executive
    security_type: string; // Type of security, e.g., "Rst. Stock Unit"
    acquisition_or_disposal: string; // 'A' for acquisition, 'D' for disposal
    shares: string; // Number of shares in string format
    share_price: string; // Price per share in string format
}

export interface CompanyInsiderTransactionData {
    data: CompanyInsiderTransaction[]; // Array of transactions
}

export interface TradingViewNewsArticle {
    source: string;
    descriptionText: string;
    publishDate: string;
    title: string
}

export interface GptNewsSummary {
    summary: NewsSummary[]
}
export interface NewsSummary {
    details: string[];
    sentiment_score: string;
    relevance_score: string;
}
