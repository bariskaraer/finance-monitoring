import axios from "axios";
import dotenv from "dotenv";
import { CompanyOverview } from "../../types.js";

dotenv.config();

export async function fetchCompanyOverview(ticker: string): Promise<CompanyOverview> {
    try {
        
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
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