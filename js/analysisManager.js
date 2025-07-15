
import { calculateCapacityAndUsage } from './analysis/capacityAnalysis.js';
import { calculateSequentialFeasibility } from './analysis/sequentialAnalysis.js';
import { generateRecommendations } from './analysis/recommendations.js';
import { calculateContractFeasibility } from './analysis/contractFeasibility.js';
import { formatFeasibilityResult } from './analysis/formatUtils.js';
import { calculateMonthlySchedule } from './analysis/calculateMonthlySchedule.js';

class AnalysisManager {
    constructor() {}

    /**
     * Calcola l'analisi completa confrontando parallelo e sequenziale
     */
    calculateAnalysis(contracts, gameDate, printCapacity, timeManager, gameHour = null) {
        const activeContracts = contracts.filter(contract => {
            // Aggiungi proprietà mancanti se necessario
            if (!contract.hasOwnProperty('completed')) {
                contract.completed = 0;
            }
            if (!contract.hasOwnProperty('status')) {
                contract.status = 'active';
            }
            if (!contract.hasOwnProperty('quantity')) {
                console.warn('⚠️ Contratto senza quantity:', contract);
                return false;
            }
            
            // Un contratto è attivo se ha status 'active' e non è ancora completato
            return (contract.status === 'active' || !contract.hasOwnProperty('status')) && 
                   contract.completed < contract.quantity;
        });
        
        if (activeContracts.length === 0) {
            return {
                totalQuantity: 0,
                capacityUsage: 0,
                monthsNeeded: 0,
                monthsAvailable: 0,
                feasible: true,
                recommendations: [{
                    type: 'success',
                    icon: 'check-circle',
                    title: 'Nessun contratto attivo',
                    description: 'Tutti i contratti sono stati completati o non hai contratti attivi.'
                }]
            };
        }
        
        // Calcoli modularizzati
        const { totalQuantity, capacityForCalculations, capacityUsage, monthsNeeded } = calculateCapacityAndUsage(activeContracts, printCapacity, gameHour);
        
        const earliestDeadline = activeContracts.reduce((earliest, contract) => {
            return new Date(contract.deadline) < new Date(earliest) ? contract.deadline : earliest;
        }, activeContracts[0].deadline);
        
        const monthsAvailable = timeManager.getMonthsDifference(gameDate, earliestDeadline);
        const feasible = monthsNeeded <= monthsAvailable;
        
        // Analisi sequenziale (FIFO)
        const seqResult = calculateSequentialFeasibility(activeContracts, gameDate, printCapacity, timeManager, gameHour);
        
        // Scegli la strategia migliore
        let strategy = 'none';
        if (feasible && seqResult.feasible) {
            strategy = 'parallelo+sequenziale';
        } else if (feasible) {
            strategy = 'parallelo';
        } else if (seqResult.feasible) {
            strategy = 'sequenziale';
        }
        // Ora puoi chiamare generateRecommendations con strategy
        const recommendations = generateRecommendations(
            contracts, totalQuantity, capacityUsage, monthsNeeded, monthsAvailable, feasible, capacityForCalculations, strategy
        );
        
        // Calcola la distribuzione mensile se ci sono contratti attivi
        const monthlySchedule = activeContracts.length > 0 ? 
            calculateMonthlySchedule(activeContracts, gameDate, printCapacity, timeManager, gameHour) : [];
        
        // Raccomandazione strategica parallelo/sequenziale
        if (strategy === 'parallelo+sequenziale') {
            recommendations.unshift({
                type: 'success',
                icon: 'check-circle',
                title: 'Fattibile in parallelo o sequenza',
                description: 'Puoi completare tutti i contratti sia producendo in parallelo che uno dopo l’altro (sequenza). Scegli la modalità che preferisci.'
            });
        } else if (strategy === 'parallelo') {
            recommendations.unshift({
                type: 'info',
                icon: 'balance-scale',
                title: 'Fattibile solo in parallelo',
                description: 'Solo producendo in parallelo (distribuendo la capacità tra tutti i contratti) riuscirai a completare tutto in tempo. La produzione sequenziale non è sufficiente.'
            });
        } else if (strategy === 'sequenziale') {
            recommendations.unshift({
                type: 'info',
                icon: 'stream',
                title: 'Fattibile solo in sequenza',
                description: 'Conviene produrre un contratto per volta (in ordine di scadenza/priorità): solo così riuscirai a completare tutti i contratti in tempo. La produzione parallela non sarebbe sufficiente.'
            });
        } else {
            recommendations.unshift({
                type: 'danger',
                icon: 'times-circle',
                title: 'Non fattibile',
                description: 'Con la capacità attuale non è possibile completare tutti i contratti in tempo, né in parallelo né in sequenza.'
            });
        }
        
        return {
            totalQuantity,
            capacityUsage,
            monthsNeeded,
            monthsAvailable,
            feasible: feasible || seqResult.feasible,
            recommendations,
            monthlySchedule,
            strategy,
            sequential: seqResult
        };
    }

    /**
     * Calcola la distribuzione mensile della produzione
     */
    calculateMonthlySchedule(...args) {
        return calculateMonthlySchedule(...args);
    }

    /**
     * Simula la produzione sequenziale (FIFO): un contratto per volta, in ordine di scadenza/priorità
     */
    calculateSequentialFeasibility(...args) {
        return calculateSequentialFeasibility(...args);
    }

    /**
     * Calcola la fattibilità di un contratto specifico
     */
    calculateContractFeasibility(contractData, gameDate, printCapacity, existingContracts, timeManager, gameHour = null) {
        return calculateContractFeasibility(contractData, gameDate, printCapacity, existingContracts, timeManager, gameHour, calculateMonthlySchedule);
    }

    /**
     * Genera raccomandazioni strategiche
     */
    generateRecommendations(...args) {
        return generateRecommendations(...args);
    }

    /**
     * Determina la strategia di produzione consigliata
     */
    getProductionStrategy(contracts) {
        const highPriorityContracts = contracts.filter(c => c.priority === 'high' && c.completed < c.quantity);
        return highPriorityContracts.length > 0 ? 'focus' : 'distribute';
    }

    /**
     * Formatta il risultato della fattibilità per la visualizzazione
     */
    formatFeasibilityResult(result, timeManager) {
        return formatFeasibilityResult(result, timeManager);
    }
}

export default AnalysisManager;
