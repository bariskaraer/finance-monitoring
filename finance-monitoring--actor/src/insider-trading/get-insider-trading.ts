import {findTopCongressMembers} from "./congress-filtering.js";
import {findTopSenators} from "./senator-filtering.js";
import {findTopStakeholders} from "./company-filtering.js";
import {getAggregateInsiderTrading} from "./aggregate.js";

export const getInsiderTrading = (quiverQuant: any, alphaVantage: any) => {
    const topSenators = findTopSenators(quiverQuant.senateTrading);
    const topRepresentatives = findTopCongressMembers(quiverQuant.congressTrading);
    const topStakeholders = findTopStakeholders(alphaVantage.companyInsiderTransactions.data);
    const aggregationRows = [topSenators.aggregation, topRepresentatives.aggregation, topStakeholders.aggregation];
    const totalAggregation = getAggregateInsiderTrading(aggregationRows)
    return {topSenators, topRepresentatives, topStakeholders, totalAggregation}
}
