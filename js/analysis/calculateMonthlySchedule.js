// Funzione per la distribuzione mensile della produzione (estratta da AnalysisManager)

export function calculateMonthlySchedule(contracts, gameDate, printCapacity, timeManager, gameHour = null) {
    const schedule = [];
    const currentDate = new Date(gameDate);
    const workingContracts = contracts.map(contract => {
        if (!contract.hasOwnProperty('quantity') || contract.quantity === undefined || contract.quantity === null) return null;
        if (!contract.hasOwnProperty('completed')) contract.completed = 0;
        return {
            ...contract,
            remaining: contract.quantity - (contract.completed || 0)
        };
    }).filter(contract => contract !== null && contract.remaining > 0);
    if (workingContracts.length === 0) return schedule;
    const maxDeadline = workingContracts.reduce((latest, contract) => {
        const deadline = new Date(contract.deadline);
        return deadline > new Date(latest) ? contract.deadline : latest;
    }, workingContracts[0].deadline);
    const totalMonths = timeManager.getMonthsDifference(gameDate, maxDeadline) + 1;
    for (let monthOffset = 0; monthOffset < totalMonths; monthOffset++) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(monthDate.getMonth() + monthOffset);
        const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
        const activeContracts = workingContracts.filter(contract => {
            const monthsUntilDeadline = timeManager.getMonthsDifference(monthKey, contract.deadline);
            return monthsUntilDeadline > 0 && contract.remaining > 0;
        });
        if (activeContracts.length === 0) continue;
        let availableCapacity = printCapacity;
        if (monthOffset === 0 && gameHour !== null) {
            const hoursPassedToday = gameHour;
            const dailyProduction = printCapacity / 30;
            const productionLostToday = (dailyProduction * hoursPassedToday) / 24;
            availableCapacity = Math.floor(printCapacity - productionLostToday);
        }
        const contractsInMonth = [];
        activeContracts.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
        const contractsWithWork = activeContracts.filter(c => c.remaining > 0);
        if (contractsWithWork.length > 0) {
            const baseCapacityPerContract = Math.floor(availableCapacity / contractsWithWork.length);
            let extraCapacity = availableCapacity % contractsWithWork.length;
            const allocations = [];
            contractsWithWork.forEach(contract => {
                let allocatedCapacity = baseCapacityPerContract;
                if (extraCapacity > 0) {
                    allocatedCapacity += 1;
                    extraCapacity -= 1;
                }
                const actualProduction = Math.min(allocatedCapacity, contract.remaining);
                const unusedCapacity = allocatedCapacity - actualProduction;
                allocations.push({
                    contract: contract,
                    allocated: allocatedCapacity,
                    production: actualProduction,
                    unused: unusedCapacity
                });
            });
            const totalUnusedCapacity = allocations.reduce((sum, alloc) => sum + alloc.unused, 0);
            if (totalUnusedCapacity > 0) {
                const contractsNeedingMore = allocations.filter(alloc => 
                    alloc.production < alloc.contract.remaining && alloc.unused === 0
                );
                if (contractsNeedingMore.length > 0) {
                    let remainingUnused = totalUnusedCapacity;
                    const extraPerContract = Math.floor(remainingUnused / contractsNeedingMore.length);
                    let extraRemainder = remainingUnused % contractsNeedingMore.length;
                    contractsNeedingMore.forEach(alloc => {
                        let extraCapacity = extraPerContract;
                        if (extraRemainder > 0) {
                            extraCapacity += 1;
                            extraRemainder -= 1;
                        }
                        const additionalProduction = Math.min(extraCapacity, 
                            alloc.contract.remaining - alloc.production);
                        alloc.production += additionalProduction;
                    });
                }
            }
            allocations.forEach(alloc => {
                if (alloc.production > 0) {
                    alloc.contract.remaining -= alloc.production;
                    contractsInMonth.push({
                        name: alloc.contract.name,
                        production: alloc.production,
                        remaining: alloc.contract.remaining,
                        priority: alloc.contract.priority || 'normal'
                    });
                }
            });
        }
        const totalProduction = contractsInMonth.reduce((sum, c) => sum + c.production, 0);
        const load = (totalProduction / availableCapacity) * 100;
        if (totalProduction > 0) {
            schedule.push({
                month: monthKey,
                monthName: timeManager.formatDate(monthKey),
                production: totalProduction,
                capacity: availableCapacity,
                load: Math.round(load * 10) / 10,
                contracts: contractsInMonth,
                feasible: load <= 100
            });
        }
        const totalRemaining = workingContracts.reduce((sum, c) => sum + c.remaining, 0);
        if (totalRemaining === 0) break;
    }
    return schedule;
}
