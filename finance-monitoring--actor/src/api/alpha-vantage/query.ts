import axios from "axios";
import dotenv from "dotenv";
import {
    CompanyBalanceSheet,
    CompanyCashFlowStatement,
    CompanyFinancials,
    CompanyInsiderTransactionData,
    CompanyOverview
} from "../../types.js";

dotenv.config();

const BASE_URL = 'https://www.alphavantage.co/query?'

export async function fetchCompanyOverview(ticker: string): Promise<CompanyOverview> {
    try {

        const response = await axios.get(
            `${BASE_URL}OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},

            }
        );
        return response.data as CompanyOverview;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchIncomeStatement(ticker: string): Promise<CompanyFinancials> {
    try {

        const response = await axios.get(
            `${BASE_URL}INCOME_STATEMENT&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},

            }
        );
        return response.data as CompanyFinancials;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchBalanceSheet(ticker: string): Promise<CompanyBalanceSheet> {
    try {

        const response = await axios.get(
            `${BASE_URL}BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},

            }
        );
        return response.data as CompanyBalanceSheet;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchCashFlowStatement(ticker: string): Promise<CompanyCashFlowStatement> {
    try {

        const response = await axios.get(
            `${BASE_URL}BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},

            }
        );
        return response.data as CompanyCashFlowStatement;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export async function fetchCompanyInsiderTransaction(ticker: string): Promise<CompanyInsiderTransactionData> {
    try {

        const response = await axios.get(
            `${BASE_URL}BALANCE_SHEET&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},

            }
        );
        return response.data as CompanyInsiderTransactionData;
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
        console.error("Error fetching data in parallel:", error);
        throw error;
    }
}

