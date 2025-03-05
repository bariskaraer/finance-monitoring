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
        console.log(response.data);
        // const data = response.data;
        // const stockData: CompanyOverview = {
        //     Symbol: data.Symbol,
        //     AssetType: data.AssetType,
        //     Name: data.Name,
        //     Description: data.Description,
        //     CIK: data.CIK,
        //     Exchange: data.Exchange,
        //     Currency: data.Currency,
        //     Country: data.Country,
        //     Sector: data.Sector,
        //     Industry: data.Industry,
        //     Address: data.Address,
        //     OfficialSite: data.OfficialSite,
        //     FiscalYearEnd: data.FiscalYearEnd,
        //     LatestQuarter: data.LatestQuarter,
        //     MarketCapitalization: data.MarketCapitalization,
        //     EBITDA: data.EBITDA,
        //     PERatio: data.PERatio,
        //     PEGRatio: data.PEGRatio,
        //     BookValue: data.BookValue,
        //     DividendPerShare: data.DividendPerShare,
        //     DividendYield: data.DividendYield,
        //     EPS: data.EPS,
        //     RevenuePerShareTTM: data.RevenuePerShareTTM,
        //     ProfitMargin: data.ProfitMargin,
        //     OperatingMarginTTM: data.OperatingMarginTTM,
        //     ReturnOnAssetsTTM: data.ReturnOnAssetsTTM,
        //     ReturnOnEquityTTM: data.ReturnOnEquityTTM,
        //     RevenueTTM: data.RevenueTTM,
        //     GrossProfitTTM: data.GrossProfitTTM,
        //     DilutedEPSTTM: data.DilutedEPSTTM,
        //     QuarterlyEarningsGrowthYOY: data.QuarterlyEarningsGrowthYOY,
        //     QuarterlyRevenueGrowthYOY: data.QuarterlyRevenueGrowthYOY,
        //     AnalystTargetPrice: data.AnalystTargetPrice,
        //     AnalystRatingStrongBuy: data.AnalystRatingStrongBuy,
        //     AnalystRatingBuy: data.AnalystRatingBuy,
        //     AnalystRatingHold: data.AnalystRatingHold,
        //     AnalystRatingSell: data.AnalystRatingSell,
        //     AnalystRatingStrongSell: data.AnalystRatingStrongSell,
        //     TrailingPE: data.TrailingPE,
        //     ForwardPE: data.ForwardPE,
        //     PriceToSalesRatioTTM: data.PriceToSalesRatioTTM,
        //     PriceToBookRatio: data.PriceToBookRatio,
        //     EVToRevenue: data.EVToRevenue,
        //     EVToEBITDA: data.EVToEBITDA,
        //     Beta: data.Beta,
        //     "52WeekHigh": data["52WeekHigh"],
        //     "52WeekLow": data["52WeekLow"],
        //     "50DayMovingAverage": data["50DayMovingAverage"],
        //     "200DayMovingAverage": data["200DayMovingAverage"],
        //     SharesOutstanding: data.SharesOutstanding,
        //     DividendDate: data.DividendDate,
        //     ExDividendDate: data.ExDividendDate,
        // };
        return response.data as CompanyOverview;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}