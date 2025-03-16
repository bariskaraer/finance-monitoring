import {TickerSearchResult} from "../types.js";

export const isTickerValid = (ticker: string, tickerSearch: TickerSearchResult): boolean => {
  return tickerSearch
      .bestMatches
      .filter(value =>
          value["1. symbol"] === ticker &&
          value["4. region"] === "United States" &&
          value["3. type"] === "Equity")
      .map(value => value)
      .length !== 0
      ;
}
