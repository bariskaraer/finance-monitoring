import {CompanyInsiderTransaction} from "../types.js";
import {log} from "apify";
import {calculateRatio} from "./aggregate.js";
import {mapForLlm} from "./senator-filtering.js";

export const findTopStakeholders = (companyInsiderTransactions: CompanyInsiderTransaction[]): any => {
    const today = new Date();
    const pastYearDate = new Date();
    pastYearDate.setFullYear(today.getFullYear() - 1);
    let totalPurchaseAmount :Number = 0;
    let totalPurchaseTransactions :Number = 0;
    let totalSaleAmount :Number = 0;
    let totalSaleTransactions :Number = 0;

    const filteredCongressTransactions = companyInsiderTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.transaction_date);
        return transactionDate >= pastYearDate && transactionDate <= today;
    });

    const groupedCongressTransactions = filteredCongressTransactions.reduce((acc, curr) => {
        const { executive_title, executive, acquisition_or_disposal, shares } = curr;
        // @ts-ignore
        if (!acc[executive]) {
            // @ts-ignore
            acc[executive] = {
                type: executive_title,
                name: executive,
                totalSaleTransactions: 0,
                totalSaleAmount: 0,
                totalPurchaseAmount: 0,
                totalPurchaseTransactions: 0,
                buySellAmountRatio: '',
                buySellTransactionRatio: '',
            };
        }

        if (acquisition_or_disposal.toLowerCase().includes("D".toLowerCase())) {
            // @ts-ignore
            acc[executive].totalSaleTransactions += 1;
            // @ts-ignore
            acc[executive].totalSaleAmount += Number(shares);
        } else if (acquisition_or_disposal.toLowerCase().includes("A".toLowerCase())) {
            // @ts-ignore
            acc[executive].totalPurchaseAmount += Number(shares);
            // @ts-ignore
            acc[executive].totalPurchaseTransactions += 1;
        }
        // @ts-ignore
        acc[executive].totalTradeNumber = acc[executive].totalSaleTransactions + acc[executive].totalPurchaseTransactions
        // @ts-ignore
        acc[executive].totalTradeAmount = acc[executive].totalSaleTransactions + acc[executive].totalPurchaseTransactions

        return acc;
    }, {});


    Object.keys(groupedCongressTransactions).forEach(value => {
        // @ts-ignore
        const representative = groupedCongressTransactions[value];
        totalPurchaseAmount += isNaN(representative.totalPurchaseAmount) ? 0 : representative.totalPurchaseAmount;
        totalPurchaseTransactions += isNaN(representative.totalPurchaseTransactions) ? 0 : representative.totalPurchaseTransactions;
        totalSaleAmount += isNaN(representative.totalSaleAmount) ? 0 : representative.totalSaleAmount;
        totalSaleTransactions += isNaN(representative.totalSaleTransactions) ? 0 :  representative.totalSaleTransactions;

    })

    Object.keys(groupedCongressTransactions).forEach(value => {
        // @ts-ignore
        const senator = groupedCongressTransactions[value];
        senator.totalPurchaseAmountPercentage = totalPurchaseAmount === 0 ? 0 : (senator.totalPurchaseAmount / Number(totalPurchaseAmount)) * 100;
        senator.totalPurchaseTransactionsPercentage = totalPurchaseTransactions === 0 ? 0 : (senator.totalPurchaseTransactions / Number(totalPurchaseTransactions)) * 100;
        senator.totalSaleAmountPercentage = totalSaleAmount === 0 ? 0 : (senator.totalSaleAmount / Number(totalSaleAmount)) * 100
        senator.totalSaleTransactionsPercentage = totalSaleTransactions === 0 ? 0 : (senator.totalSaleTransactions / Number(totalSaleTransactions)) * 100
        senator.buySellAmountRatio = `${senator.totalPurchaseAmount}/${senator.totalSaleAmount}`;
        senator.buySellTransactionRatio = `${senator.totalPurchaseTransactions}/${senator.totalSaleTransactions}`;
        senator.totalAmount = senator.totalPurchaseAmount + senator.totalSaleAmount;
        senator.totalTransaction = senator.totalPurchaseTransactions + senator.totalSaleTransactions;
    })

    const topPurchaseAmountStakeholders = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalPurchaseAmountPercentage !== 0)
        .sort((a, b) => b.totalPurchaseAmountPercentage - a.totalPurchaseAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topPurchaseTransactionsStakeholders = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalPurchaseTransactionsPercentage !== 0)
        .sort((a, b) => b.totalPurchaseTransactionsPercentage - a.totalPurchaseTransactionsPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;


    const topSaleAmountStakeholders = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalSaleAmountPercentage !== 0)
        .sort((a, b) => b.totalSaleAmountPercentage - a.totalSaleAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topSaleTransactionsStakeholders = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalSaleTransactionsPercentage !== 0)
        .sort((a, b) => b.totalSaleTransactionsPercentage - a.totalSaleTransactionsPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const aggregation = {
        totalPurchaseAmount,
        totalPurchaseTransactions,
        totalSaleAmount,
        totalSaleTransactions
    }

    const topStakeholders = {
        topPurchaseTransactionsStakeholders,
        topPurchaseAmountStakeholders,
        topSaleAmountStakeholders,
        topSaleTransactionsStakeholders
    }

    return  {topStakeholders, aggregation}
}
