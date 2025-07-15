/**
 * Gestione della produzione
 */
class ProductionManager {
    constructor() {
        this.printCapacity = 0;
    }

    /**
     * Processa la produzione mensile
     */
    processMonthlyProduction(contracts, printCapacity, gameHour, timeManager) {
        const results = [];
        
        // Validazione e filtraggio dei contratti
        const validContracts = contracts.filter(contract => {
            // Aggiungi proprietà mancanti se necessario
            if (!contract.hasOwnProperty('completed')) {
                contract.completed = 0;
            }
            if (!contract.hasOwnProperty('status')) {
                contract.status = 'active';
            }
            if (!contract.hasOwnProperty('quantity') || contract.quantity === undefined || contract.quantity === null) {
                console.warn('⚠️ Contratto senza quantity nel processMonthlyProduction:', contract);
                return false;
            }
            if (!contract.hasOwnProperty('priority')) {
                contract.priority = 'normal';
            }
            
            // Solo contratti attivi e non completati
            return (contract.status === 'active' || !contract.hasOwnProperty('status')) && 
                   contract.completed < contract.quantity;
        });
        
        if (validContracts.length === 0) {
            console.log('📋 Nessun contratto valido da processare');
            return results;
        }
        
        console.log(`🏭 Processing ${validContracts.length} contratti validi`);
        
        // Calcola la capacità effettiva considerando l'orario
        const partialMonthFactor = timeManager.getPartialMonthProduction(gameHour);
        const effectiveCapacity = Math.floor(printCapacity * partialMonthFactor);
        
        let remainingCapacity = effectiveCapacity;
        
        // Ottieni la strategia di produzione consigliata
        const strategy = this.getProductionStrategy(validContracts);
        
        if (strategy === 'focus') {
            // Concentra su contratti prioritari
            const priorityContracts = validContracts.filter(c => c.priority === 'high');
            
            // Prima processa i contratti prioritari
            for (const contract of priorityContracts) {
                const needed = contract.quantity - contract.completed;
                const produced = Math.min(needed, remainingCapacity);
                
                if (produced > 0) {
                    contract.completed += produced;
                    remainingCapacity -= produced;
                    results.push({
                        name: contract.name,
                        produced: produced,
                        total: contract.quantity,
                        completed: contract.completed,
                        priority: true
                    });
                }
                
                if (remainingCapacity <= 0) break;
            }
            
            // Poi processa i contratti normali se c'è capacità rimanente
            if (remainingCapacity > 0) {
                const normalContracts = validContracts.filter(c => c.priority === 'normal');
                for (const contract of normalContracts) {
                    const needed = contract.quantity - contract.completed;
                    const produced = Math.min(needed, remainingCapacity);
                    
                    if (produced > 0) {
                        contract.completed += produced;
                        remainingCapacity -= produced;
                        results.push({
                            name: contract.name,
                            produced: produced,
                            total: contract.quantity,
                            completed: contract.completed,
                            priority: false
                        });
                    }
                    
                    if (remainingCapacity <= 0) break;
                }
            }
        } else {
            // Distribuzione equa tra tutti i contratti con ottimizzazione
            const activeContracts = validContracts.filter(c => c.completed < c.quantity);
            
            if (activeContracts.length > 0) {
                const allocations = this.calculateOptimalAllocations(activeContracts, effectiveCapacity);
                
                // Applica le allocazioni finali
                allocations.forEach(alloc => {
                    if (alloc.production > 0) {
                        alloc.contract.completed += alloc.production;
                        results.push({
                            name: alloc.contract.name,
                            produced: alloc.production,
                            total: alloc.contract.quantity,
                            completed: alloc.contract.completed,
                            priority: alloc.contract.priority === 'high'
                        });
                    }
                });
            }
        }
        
        // Aggiungi informazioni sulla produzione parziale nei risultati
        if (partialMonthFactor < 1) {
            results.partialProduction = {
                factor: partialMonthFactor,
                percentage: Math.round(partialMonthFactor * 100),
                startHour: gameHour
            };
        }
        
        return results;
    }

    /**
     * Calcola le allocazioni ottimali per i contratti
     */
    calculateOptimalAllocations(activeContracts, effectiveCapacity) {
        // Prima allocazione: distribuzione equa di base
        const baseCapacityPerContract = Math.floor(effectiveCapacity / activeContracts.length);
        let extraCapacity = effectiveCapacity % activeContracts.length;
        
        const allocations = [];
        
        // Assegna capacità base a ciascun contratto
        activeContracts.forEach(contract => {
            let allocatedCapacity = baseCapacityPerContract;
            
            // Distribuisci capacità extra
            if (extraCapacity > 0) {
                allocatedCapacity += 1;
                extraCapacity -= 1;
            }
            
            // Calcola produzione effettiva (non può superare il lavoro rimanente)
            const actualProduction = Math.min(allocatedCapacity, contract.quantity - contract.completed);
            const unusedCapacity = allocatedCapacity - actualProduction;
            
            allocations.push({
                contract: contract,
                allocated: allocatedCapacity,
                production: actualProduction,
                unused: unusedCapacity
            });
        });
        
        // Raccogli la capacità non utilizzata
        const totalUnusedCapacity = allocations.reduce((sum, alloc) => sum + alloc.unused, 0);
        
        // Redistribuisci la capacità non utilizzata tra i contratti che possono ancora utilizzarla
        if (totalUnusedCapacity > 0) {
            const contractsNeedingMore = allocations.filter(alloc => 
                alloc.production < (alloc.contract.quantity - alloc.contract.completed) && alloc.unused === 0
            );
            
            if (contractsNeedingMore.length > 0) {
                let remainingUnused = totalUnusedCapacity;
                
                // Ridistribuisci equamente tra i contratti che ne hanno bisogno
                const extraPerContract = Math.floor(remainingUnused / contractsNeedingMore.length);
                let extraRemainder = remainingUnused % contractsNeedingMore.length;
                
                contractsNeedingMore.forEach(alloc => {
                    let extraCapacity = extraPerContract;
                    if (extraRemainder > 0) {
                        extraCapacity += 1;
                        extraRemainder -= 1;
                    }
                    
                    // Aggiungi capacità extra, ma non superare il lavoro rimanente
                    const additionalProduction = Math.min(extraCapacity, 
                        (alloc.contract.quantity - alloc.contract.completed) - alloc.production);
                    alloc.production += additionalProduction;
                });
            }
        }
        
        return allocations;
    }

    /**
     * Determina la strategia di produzione
     */
    getProductionStrategy(contracts) {
        const highPriorityContracts = contracts.filter(c => c.priority === 'high' && c.completed < c.quantity);
        return highPriorityContracts.length > 0 ? 'focus' : 'distribute';
    }

    /**
     * Calcola la schedulazione mensile
     */
    calculateMonthlySchedule(contracts, gameDate, printCapacity, timeManager, gameHour) {
        const schedule = [];
        const currentDate = new Date(gameDate);
        
        // Crea una copia dei contratti con il lavoro rimanente
        const workingContracts = contracts.map(contract => ({
            ...contract,
            remaining: contract.quantity - (contract.completed || 0)
        })).filter(contract => contract.remaining > 0);
        
        if (workingContracts.length === 0) return schedule;
        
        // Calcola quanti mesi abbiamo bisogno di considerare
        const maxDeadline = workingContracts.reduce((latest, contract) => {
            return new Date(contract.deadline) > new Date(latest) ? contract.deadline : latest;
        }, workingContracts[0].deadline);
        
        const totalMonths = timeManager.getMonthsDifference(gameDate, maxDeadline) + 1;
        
        // Simulazione realistica: usa sempre il 100% della capacità se ci sono contratti
        for (let monthOffset = 0; monthOffset < totalMonths; monthOffset++) {
            const monthDate = new Date(currentDate);
            monthDate.setMonth(monthDate.getMonth() + monthOffset);
            const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            // Contratti attivi in questo mese (non ancora scaduti)
            const activeContracts = workingContracts.filter(contract => {
                const contractDeadline = new Date(contract.deadline);
                const monthsUntilDeadline = timeManager.getMonthsDifference(monthKey, contract.deadline);
                // CORRETTO: attivo solo se il mese corrente è minore della deadline
                return monthsUntilDeadline > 0 && contract.remaining > 0;
            });
            
            if (activeContracts.length === 0) continue;
            
            // Calcola la capacità disponibile per questo mese
            let availableCapacity = printCapacity;
            
            // Se stiamo simulando il mese corrente, considera la produzione parziale
            if (monthOffset === 0 && gameHour !== null) {
                const partialFactor = timeManager.getPartialMonthProduction(gameHour);
                availableCapacity = Math.floor(availableCapacity * partialFactor);
            }
            
            const contractsInMonth = [];
            
            // Ordina i contratti: prima quelli prioritari, poi per scadenza
            activeContracts.sort((a, b) => {
                if (a.priority === 'high' && b.priority !== 'high') return -1;
                if (b.priority === 'high' && a.priority !== 'high') return 1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
            
            // Distribuzione equa della capacità tra tutti i contratti attivi con ottimizzazione
            const contractsWithWork = activeContracts.filter(c => c.remaining > 0);
            if (contractsWithWork.length > 0) {
                const allocations = this.calculateOptimalAllocations(contractsWithWork, availableCapacity);
                
                // Applica le allocazioni finali
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
            const load = (totalProduction / printCapacity) * 100;
            
            if (totalProduction > 0) {
                schedule.push({
                    month: monthKey,
                    monthName: timeManager.formatDate(monthKey),
                    production: totalProduction,
                    capacity: printCapacity,
                    load: Math.round(load * 10) / 10,
                    contracts: contractsInMonth,
                    feasible: load <= 100
                });
            }
            
            // Se non c'è più lavoro da fare, interrompi
            const totalRemaining = workingContracts.reduce((sum, c) => sum + c.remaining, 0);
            if (totalRemaining === 0) break;
        }
        
        return schedule;
    }
}

export default ProductionManager;
