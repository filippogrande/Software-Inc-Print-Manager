// Funzioni per analisi sequenziale (FIFO)

export function calculateSequentialFeasibility(contracts, gameDate, printCapacity, timeManager, gameHour = null) {
    const sorted = [...contracts].sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return new Date(a.deadline) - new Date(b.deadline);
    });
    let currentDate = new Date(gameDate);
    let hour = gameHour || 0;
    let feasible = true;
    let lastCompletionDate = null;
    let details = [];
    let monthlySchedule = [];
    let contractsState = sorted.map(c => ({ ...c, remaining: c.quantity - (c.completed || 0) }));
    let monthIndex = 0;
    while (contractsState.some(c => c.remaining > 0)) {
        let monthDate = new Date(currentDate);
        let monthName = monthDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
        let capacity = printCapacity;
        if (monthIndex === 0 && hour > 0) {
            const maxMonthHours = timeManager.getMaxMonthHours(currentDate);
            const partial = timeManager.getPartialMonthProduction(hour, maxMonthHours);
            const remainingHours = maxMonthHours - hour;
            console.log(`Capacità effettiva mese iniziale (${monthName}): ${capacity} * (${remainingHours} / ${maxMonthHours}) = ${Math.floor(printCapacity * partial)}`);
            capacity = Math.floor(printCapacity * partial);
        }
        let production = 0;
        let contractsInMonth = contractsState.map(c => ({
            name: c.name,
            production: 0,
            priority: c.priority,
            remaining: c.remaining
        }));
        // Consuma la capacità in sequenza sui contratti
        let capLeft = capacity;
        for (let i = 0; i < contractsState.length && capLeft > 0; i++) {
            let c = contractsState[i];
            if (c.remaining > 0) {
                let produced = Math.min(c.remaining, capLeft);
                contractsInMonth[i].production = produced;
                contractsInMonth[i].remaining = c.remaining - produced;
                production += produced;
                capLeft -= produced;
                c.remaining -= produced;
            }
        }
        let load = capacity > 0 ? Math.round((production / capacity) * 100) : 0;
        let monthFeasible = true;
        // Se un contratto non completato ha superato la deadline, non fattibile
        for (let c of contractsState) {
            if (c.remaining > 0 && new Date(currentDate) >= new Date(c.deadline)) {
                feasible = false;
                monthFeasible = false;
            }
        }
        monthlySchedule.push({
            monthName,
            production,
            capacity,
            load,
            feasible: monthFeasible,
            contracts: contractsInMonth
        });
        // Avanza di un mese
        currentDate.setMonth(currentDate.getMonth() + 1);
        hour = 0;
        monthIndex++;
        // Se tutti i contratti sono completati, salva la data
        if (contractsState.every(c => c.remaining <= 0)) {
            lastCompletionDate = new Date(currentDate);
        }
        // Se la data supera la deadline di un contratto non completato, esci
        if (contractsState.some(c => c.remaining > 0 && new Date(currentDate) > new Date(c.deadline))) {
            feasible = false;
            break;
        }
    }
    return {
        feasible,
        lastCompletionDate,
        details,
        monthlySchedule
    };
}
