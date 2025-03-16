import {CongressTransaction} from "../types.js";
import {mapForLlm} from "./senator-filtering.js";

export const findTopCongressMembers = (congressTransactions: CongressTransaction[]):any => {
    // Filter between dates (inclusive)
    const today = new Date();
    const pastYearDate = new Date();
    pastYearDate.setFullYear(today.getFullYear() - 1);
    let totalPurchaseAmount: Number = 0;
    let totalPurchaseTransactions : Number = 0;
    let totalSaleAmount: Number = 0;
    let totalSaleTransactions: Number = 0;


    const filteredCongressTransactions = congressTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.TransactionDate);
        return transactionDate >= pastYearDate && transactionDate <= today;
    });

    const groupedCongressTransactions = filteredCongressTransactions.reduce((acc, curr) => {
        const { Representative, Transaction, Amount } = curr;
        // @ts-ignore
        if (!acc[Representative]) {
            // @ts-ignore
            acc[Representative] = {
                type: "REPRESENTATIVE",
                name: Representative,
                totalSaleTransactions: 0,
                totalSaleAmount: 0,
                totalPurchaseAmount: 0,
                totalPurchaseTransactions: 0
            };
        }

        if (Transaction.toLowerCase().includes("Sale".toLowerCase()) || Transaction.toLowerCase().includes("Sale (Full)".toLowerCase()) || Transaction.toLowerCase().includes("Sale (Partial)".toLowerCase())) {
            // @ts-ignore
            acc[Representative].totalSaleTransactions += 1;
            // @ts-ignore
            acc[Representative].totalSaleAmount += Number(Amount);
        } else if (Transaction.toLowerCase().includes("Purchase".toLowerCase())) {
            // @ts-ignore
            acc[Representative].totalPurchaseAmount += Number(Amount);
            // @ts-ignore
            acc[Representative].totalPurchaseTransactions += 1;
        }
        // @ts-ignore
        acc[Representative].totalTradeNumber = acc[Representative].totalSaleTransactions + acc[Representative].totalPurchaseTransactions
        // @ts-ignore
        acc[Representative].totalTradeAmount = acc[Representative].totalSaleTransactions + acc[Representative].totalPurchaseTransactions

        return acc;
    }, {});


    Object.keys(groupedCongressTransactions).forEach(value => {
        // @ts-ignore
        const representative = groupedCongressTransactions[value];
        totalPurchaseAmount += isNaN(representative.totalPurchaseAmount) ? 0 : representative.totalPurchaseAmount;
        totalPurchaseTransactions += isNaN(representative.totalPurchaseTransactions) ? 0 : representative.totalPurchaseTransactions;
        totalSaleAmount += isNaN(representative.totalSaleAmount) ? 0 : representative.totalSaleAmount;
        totalSaleTransactions += isNaN(representative.totalSaleTransactions) ? 0 :  representative.totalSaleTransactions
    })

    Object.keys(groupedCongressTransactions).forEach(value => {
        // @ts-ignore
        const senator = groupedCongressTransactions[value];
        senator.totalPurchaseAmountPercentage = totalPurchaseAmount === 0 ? 0 : (senator.totalPurchaseAmount / Number(totalPurchaseAmount)) * 100;
        senator.totalPurchaseTransactionsPercentage = totalPurchaseTransactions === 0 ? 0 : (senator.totalPurchaseTransactions / Number(totalPurchaseTransactions)) * 100;
        senator.totalSaleAmountPercentage = totalSaleAmount === 0 ? 0 : (senator.totalSaleAmount / Number(totalSaleAmount)) * 100;
        senator.totalSaleTransactionsPercentage = totalSaleTransactions === 0 ? 0 : (senator.totalSaleTransactions / Number(totalSaleTransactions)) * 100;
        senator.buySellAmountRatio = `${senator.totalPurchaseAmount}/${senator.totalSaleAmount}`;
        senator.buySellTransactionRatio = `${senator.totalPurchaseTransactions}/${senator.totalSaleTransactions}`;
        senator.totalAmount = senator.totalPurchaseAmount + senator.totalSaleAmount;
        senator.totalTransaction = senator.totalPurchaseTransactions + senator.totalSaleTransactions
    })

    const topPurchaseAmountRepresentatives = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalPurchaseAmountPercentage !== 0)
        .sort((a, b) => b.totalPurchaseAmountPercentage - a.totalPurchaseAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topPurchaseTransactionsRepresentatives = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalPurchaseTransactionsPercentage !== 0)
        .sort((a, b) => b.totalPurchaseTransactionsPercentage - a.totalPurchaseTransactionsPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;


    const topSaleAmountRepresentatives = Object.keys(groupedCongressTransactions).map(key => {
        // @ts-ignore
        return groupedCongressTransactions[key];
    }).filter(value => value.totalSaleAmountPercentage !== 0)
        .sort((a, b) => b.totalSaleAmountPercentage - a.totalSaleAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topSaleTransactionsRepresentatives = Object.keys(groupedCongressTransactions).map(key => {
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

    const topRepresentatives = {
        topPurchaseTransactionsRepresentatives,
        topPurchaseAmountRepresentatives,
        topSaleAmountRepresentatives,
        topSaleTransactionsRepresentatives
    }

    return  {topRepresentatives, aggregation}

}
