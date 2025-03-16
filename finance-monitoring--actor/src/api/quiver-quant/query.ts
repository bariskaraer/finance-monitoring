import axios from "axios";
import dotenv from "dotenv";
import { CongressTransaction, SenatorTransaction } from "../../types.js";
import {
    fetchBalanceSheet,
    fetchCashFlowStatement, fetchCompanyInsiderTransaction,
    fetchCompanyOverview,
    fetchIncomeStatement
} from "../alpha-vantage/query.js";

dotenv.config();

export async function fetchSenateTrading(ticker: string): Promise<SenatorTransaction[]> {
    try {
        const response = await axios.get(
            `https://api.quiverquant.com/beta/historical/senatetrading/${ticker}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.QUIVER_QUANT_API_KEY}`,
                },
            }
        );
        return response.data as SenatorTransaction[];
    } catch (error) {
        // console.error("Error fetching data:", error);
        throw new Error("An error occured while fetching quiver quant insider data.");
    }
}

export async function fetchCongressTrading(ticker: string): Promise<CongressTransaction[]> {
    try {
        const response = await axios.get(
            `https://api.quiverquant.com/beta/historical/congresstrading/${ticker}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${process.env.QUIVER_QUANT_API_KEY}`,
                },
            }
        );
        return response.data as CongressTransaction[];
    } catch (error) {
        // console.error("Error fetching data:", error);
        throw new Error("An error occured while fetching quiver quant insider data.");
    }
}

export async function parallelFetchQuiverQuant(ticker: string) {
    try {
        const [senateTrading, congressTrading] = await Promise.all([
            fetchSenateTrading(ticker),
            fetchCongressTrading(ticker)
        ]);

        return {
            senateTrading, congressTrading
        };
    } catch (error) {
        console.error("Error fetching data in parallel:", error);
        throw error;
    }
}
