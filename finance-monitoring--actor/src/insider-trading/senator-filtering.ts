import {SenatorTransaction} from "../types.js";

export const findTopSenators = (senatorTransactions:  SenatorTransaction[]): any => {
    const today = new Date();
    const pastYearDate = new Date();
    pastYearDate.setFullYear(today.getFullYear() - 1);
    let totalPurchaseAmount = 0;
    let totalPurchaseTransactions = 0;
    let totalSaleAmount = 0;
    let totalSaleTransactions = 0;

    const filteredSenateTransactions = senatorTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.Date);
        return transactionDate >= pastYearDate && transactionDate <= today;
    });

    const groupedSenateTransactions = filteredSenateTransactions.reduce((acc, curr) => {
        const { Senator, Transaction, Amount } = curr;
        const amount = parseFloat(Amount);
        // @ts-ignore
        if (!acc[Senator]) {
            // @ts-ignore
            acc[Senator] = {
                type: "SENATOR",
                name: Senator,
                totalSaleTransactions: 0,
                totalSaleAmount: 0,
                totalPurchaseAmount: 0,
                totalPurchaseTransactions: 0
            };
        }

        if (Transaction.toLowerCase().includes("Sale".toLowerCase()) || Transaction.toLowerCase().includes("Sale (Full)".toLowerCase()) || Transaction.toLowerCase().includes("Sale (Partial)".toLowerCase())) {
            // @ts-ignore
            acc[Senator].totalSaleTransactions += 1;
            // @ts-ignore
            acc[Senator].totalSaleAmount += amount;
        } else if (Transaction.toLowerCase().includes("Purchase".toLowerCase())) {
            // @ts-ignore
            acc[Senator].totalPurchaseAmount += amount;
            // @ts-ignore
            acc[Senator].totalPurchaseTransactions += 1;
        }
        // @ts-ignore
        acc[Senator].totalTradeNumber = acc[Senator].totalSaleTransactions + acc[Senator].totalPurchaseTransactions
        // @ts-ignore
        acc[Senator].totalTradeAmount = acc[Senator].totalSaleTransactions + acc[Senator].totalPurchaseTransactions

        return acc;
    }, {});

    Object.keys(groupedSenateTransactions).forEach(value => {
        // @ts-ignore
        const senator = groupedSenateTransactions[value];
        totalPurchaseAmount += isNaN(senator.totalPurchaseAmount) ? 0 : senator.totalPurchaseAmount;
        totalPurchaseTransactions += isNaN(senator.totalPurchaseTransactions) ? 0 : senator.totalPurchaseTransactions;
        totalSaleAmount += isNaN(senator.totalSaleAmount) ? 0 : senator.totalSaleAmount;
        totalSaleTransactions += isNaN(senator.totalSaleTransactions) ? 0 :  senator.totalSaleTransactions
    })

    Object.keys(groupedSenateTransactions).forEach(value => {
        // @ts-ignore
        const senator = groupedSenateTransactions[value];
        senator.totalPurchaseAmountPercentage = totalPurchaseAmount === 0 ? 0 : (senator.totalPurchaseAmount / Number(totalPurchaseAmount)) * 100;
        senator.totalPurchaseTransactionsPercentage = totalPurchaseTransactions === 0 ? 0 : (senator.totalPurchaseTransactions / Number(totalPurchaseTransactions)) * 100;
        senator.totalSaleAmountPercentage = totalSaleAmount === 0 ? 0 : (senator.totalSaleAmount / Number(totalSaleAmount)) * 100;
        senator.totalSaleTransactionsPercentage = totalSaleTransactions === 0 ? 0 : (senator.totalSaleTransactions / Number(totalSaleTransactions)) * 100;
        senator.buySellAmountRatio = `${senator.totalPurchaseAmount}/${senator.totalSaleAmount}`;
        senator.buySellTransactionRatio = `${senator.totalPurchaseTransactions}/${senator.totalSaleTransactions}`;
        senator.totalAmount = senator.totalPurchaseAmount + senator.totalSaleAmount;
        senator.totalTransaction = senator.totalPurchaseTransactions + senator.totalSaleTransactions;
    })

    const topPurchaseAmountSenators = Object.keys(groupedSenateTransactions)
        .map(key => {
        // @ts-ignore
        return groupedSenateTransactions[key];
    }).filter(value => value.totalPurchaseAmountPercentage !== 0)
        .sort((a, b) => b.totalPurchaseAmountPercentage - a.totalPurchaseAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topPurchaseTransactionsSenators = Object.keys(groupedSenateTransactions)
        .map(key => {
        // @ts-ignore
        return groupedSenateTransactions[key];
    }).filter(value => value.totalPurchaseTransactionsPercentage !== 0)
        .sort((a, b) => b.totalPurchaseTransactionsPercentage - a.totalPurchaseTransactionsPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;


    const topSaleAmountSenators = Object.keys(groupedSenateTransactions)
        .map(key => {
        // @ts-ignore
        return groupedSenateTransactions[key];
    }).filter(value => value.totalSaleAmountPercentage !== 0)
        .sort((a, b) => b.totalSaleAmountPercentage - a.totalSaleAmountPercentage)
        .slice(0, 3)
        .map(value => mapForLlm(value))
    ;

    const topSaleTransactionsSenators = Object.keys(groupedSenateTransactions)
        .map(key => {
        // @ts-ignore
        return groupedSenateTransactions[key];
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

    const topSenators = {
        topPurchaseTransactionsSenators,
        topPurchaseAmountSenators,
        topSaleAmountSenators,
        topSaleTransactionsSenators
    }

    return  {topSenators, aggregation}
}

export const mapForLlm = (senator: any) => {
    return {
        name: `${senator.name} (${senator.type})`,
        tradedShares: senator.totalAmount,
        numberOfTransactions: senator.totalTransaction,
        buySellAmountRatio: senator.buySellAmountRatio,
        buySellTransactionsRatio: senator.buySellTransactionRatio,
    }
}
