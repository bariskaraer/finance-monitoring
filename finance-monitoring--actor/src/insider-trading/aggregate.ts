export const getAggregateInsiderTrading = (aggregations: any) => {
    const totalAggregation = {
        totalPurchaseAmount: 0,
        totalPurchaseTransactions: 0,
        totalSaleAmount: 0,
        totalSaleTransactions: 0
    }
    for (const aggregation of aggregations) {
        totalAggregation.totalPurchaseAmount += Number(aggregation.totalPurchaseAmount);
        totalAggregation.totalPurchaseTransactions += Number(aggregation.totalPurchaseTransactions);
        totalAggregation.totalSaleAmount += Number(aggregation.totalSaleAmount);
        totalAggregation.totalSaleTransactions += Number(aggregation.totalSaleTransactions);
    }
    return totalAggregation;
}

export const calculateRatio = (top: number, bottom: number): number => {
  if(top === 0 && bottom === 0) {
      return -1;
  }
  if(bottom === 0) {
      return 100;
  }
  return (top / bottom) * 100
}
