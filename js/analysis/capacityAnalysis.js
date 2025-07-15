// Funzioni per analisi capacità e distribuzione mensile

export function calculateCapacityAndUsage(contracts, printCapacity, gameHour) {
    let effectiveFirstMonthCapacity = printCapacity;
    if (gameHour !== null) {
        const dailyProduction = printCapacity / 30;
        const hoursPassedToday = gameHour;
        const productionLostToday = (dailyProduction * hoursPassedToday) / 24;
        effectiveFirstMonthCapacity = Math.floor(printCapacity - productionLostToday);
    }
    const totalQuantity = contracts.reduce((sum, contract) => sum + (contract.quantity - contract.completed), 0);
    const capacityForCalculations = effectiveFirstMonthCapacity;
    const capacityUsage = Math.round((totalQuantity / capacityForCalculations) * 100);
    const monthsNeeded = Math.ceil(totalQuantity / capacityForCalculations);
    return { totalQuantity, capacityForCalculations, capacityUsage, monthsNeeded };
}
