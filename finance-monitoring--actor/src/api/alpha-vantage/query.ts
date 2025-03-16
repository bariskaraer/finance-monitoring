import axios from "axios";
import dotenv from "dotenv";
import {
    CompanyBalanceSheet,
    CompanyCashFlowStatement,
    CompanyFinancials,
    CompanyInsiderTransactionData,
    CompanyOverview,
    NewsFeed, TickerSearchResult
} from "../../types.js";
import {log} from "apify";

dotenv.config();

const BASE_URL = 'https://www.alphavantage.co/query?function='
const HEADERS = {
    headers: {'User-Agent': 'request'},
}

export async function fetchCompanyOverview(ticker: string): Promise<CompanyOverview> {
    try {
        const url = `${BASE_URL}OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
        const response = await axios.get(
            url,
            HEADERS
        );
        return response.data as CompanyOverview;
    } catch (error) {
        log.error(`Error fetching data in for fetchCompanyOverview. (error: ${error})`);
        throw error;
    }
}

export async function fetchIncomeStatement(ticker: string): Promise<CompanyFinancials> {
    try {

        const response = await axios.get(
            `${BASE_URL}INCOME_STATEMENT&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as CompanyFinancials;
    } catch (error) {
        log.error(`Error fetching data in for fetchIncomeStatement. (error: ${error})`);
        throw error;
    }
}

export async function fetchBalanceSheet(ticker: string): Promise<CompanyBalanceSheet> {
    try {

        const response = await axios.get(
            `${BASE_URL}BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as CompanyBalanceSheet;
    } catch (error) {
        log.error(`Error fetching data in for fetchBalanceSheet. (error: ${error})`);
        throw error;
    }
}

export async function fetchCashFlowStatement(ticker: string): Promise<CompanyCashFlowStatement> {
    try {

        const response = await axios.get(
            `${BASE_URL}BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as CompanyCashFlowStatement;
    } catch (error) {
        log.error(`Error fetching data in for fetchCashFlowStatement. (error: ${error})`);
        throw error;
    }
}

export async function fetchCompanyInsiderTransaction(ticker: string): Promise<CompanyInsiderTransactionData> {
    try {

        const response = await axios.get(
            `${BASE_URL}INSIDER_TRANSACTIONS&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as CompanyInsiderTransactionData;
    } catch (error) {
        log.error(`Error fetching data in for fetchCompanyInsiderTransaction. (error: ${error})`);
        throw error;
    }
}

export async function fetchNewsSentiment(ticker: string): Promise<NewsFeed> {
    try {
        const response = await axios.get(
            `${BASE_URL}NEWS_SENTIMENT&symbol=${ticker}&limit=100&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as NewsFeed;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchTickerSearch(ticker: string): Promise<TickerSearchResult> {
    try {
        const response = await axios.get(
            `${BASE_URL}SYMBOL_SEARCH&keywords=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            HEADERS
        );
        return response.data as TickerSearchResult;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function parallelFetchAlphaVantage(ticker: string) {
    try {
        const [companyOverview, balanceSheet, incomeStatement, cashFlowStatement, companyInsiderTransactions] = await Promise.all([
            fetchCompanyOverview(ticker),
            fetchBalanceSheet(ticker),
            fetchIncomeStatement(ticker),
            fetchCashFlowStatement(ticker),
            fetchCompanyInsiderTransaction(ticker)
        ]);

        return {
            companyOverview,
            balanceSheet,
            incomeStatement,
            cashFlowStatement,
            companyInsiderTransactions
        };
    } catch (error) {
        log.error(`Error fetching data in parallel for alpha vantage. (error: ${error})`);
        throw error;
    }
}

