import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export async function fetchCompanyOverview(ticker: string) {
    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`,
            {
                headers: {'User-Agent': 'request'},
            }
        );
        console.log(response.data); // Handle the fetched data
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}