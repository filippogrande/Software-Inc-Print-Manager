// Funzione per calcolare la fattibilità di un singolo contratto

export function calculateContractFeasibility(contractData, gameDate, printCapacity, existingContracts, timeManager, gameHour = null, calculateMonthlySchedule) {
    if (!contractData || !contractData.hasOwnProperty('quantity') || contractData.quantity === undefined || contractData.quantity === null) {
        return {
            name: contractData?.name || 'Unknown',
            quantity: 0,
            deadline: contractData?.deadline || gameDate,
            monthsAvailable: 0,
            monthlyCapacityNeeded: 0,
            feasible: false,
            soloFeasible: false,
            monthlySchedule: [],
            completionDate: null,
            totalMonthsNeeded: 0,
            monthsToEarliest: 0
        };
    }
    const { name, quantity, deadline } = contractData;
    const now = new Date(gameDate);
    const contractDeadline = new Date(deadline);
    contractDeadline.setDate(contractDeadline.getDate());
    contractDeadline.setHours(23, 59, 59, 999);
    const monthsAvailable = timeManager.getMonthsDifference(now, contractDeadline);
    if (monthsAvailable <= 0) {
        return {
            name,
            quantity,
            deadline,
            monthsAvailable: 0,
            monthlyCapacityNeeded: quantity,
            feasible: false,
            soloFeasible: false,
            monthlySchedule: [],
            completionDate: null,
            totalMonthsNeeded: 0,
            monthsToEarliest: 0
        };
    }
    const monthlyCapacityNeeded = Math.ceil(quantity / monthsAvailable);
    const soloFeasible = monthlyCapacityNeeded <= printCapacity;
    const tempContract = {
        id: 'temp',
        name,
        quantity,
        deadline,
        completed: 0,
        priority: contractData.priority || 'normal'
    };
    const allContracts = [...existingContracts, tempContract];
    const monthlySchedule = calculateMonthlySchedule(allContracts, gameDate, printCapacity, timeManager, gameHour);
    let completionDate = null;
    let totalProduced = 0;
    for (const month of monthlySchedule) {
        const contractInMonth = month.contracts.find(c => c.name === name);
        if (contractInMonth) {
            totalProduced += contractInMonth.production;
            if (totalProduced >= quantity) {
                completionDate = month.month;
                break;
            }
        }
    }
    const allMonthsFeasible = monthlySchedule.every(month => month.load <= 100);
    const completedInTime = completionDate && new Date(completionDate) <= contractDeadline;
    const feasible = allMonthsFeasible && completedInTime;
    return {
        name,
        quantity,
        deadline,
        monthsAvailable,
        monthlyCapacityNeeded,
        feasible,
        soloFeasible,
        monthlySchedule,
        completionDate,
        totalMonthsNeeded: monthlySchedule.length,
        monthsToEarliest: monthsAvailable
    };
}
