import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();

export async function fetchCongressTrading(ticker: string) {
    try {
        const response = await axios.get(`https://api.quiverquant.com/beta/historical/senatetrading/${ticker}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.QUIVER_QUANT_API_KEY}`,
            },
        });
        // console.log(response.data); // Handle the fetched data
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
