// Funzioni per generare raccomandazioni strategiche

export function generateRecommendations(contracts, totalQuantity, capacityUsage, monthsNeeded, monthsAvailable, feasible, printCapacity, strategy = null) {
    const recommendations = [];
    const activeContracts = contracts.filter(contract => {
        if (!contract.hasOwnProperty('completed')) contract.completed = 0;
        if (!contract.hasOwnProperty('quantity') || contract.quantity === undefined || contract.quantity === null) return false;
        return contract.completed < contract.quantity;
    });
    if (feasible) {
        recommendations.push({
            type: 'success',
            icon: 'check-circle',
            title: 'Tutti i contratti sono fattibili',
            description: `Puoi completare tutti i contratti attivi entro le scadenze con la tua capacità attuale.`
        });
    } else {
        recommendations.push({
            type: 'danger',
            icon: 'exclamation-triangle',
            title: 'Capacità insufficiente',
            description: `Ti servono ${monthsNeeded} mesi ma ne hai solo ${monthsAvailable} disponibili. Considera di rifiutare alcuni contratti.`
        });
    }
    const highPriorityContracts = activeContracts.filter(c => c.priority === 'high');
    if (highPriorityContracts.length > 0) {
        const highPriorityTotal = highPriorityContracts.reduce((sum, contract) => sum + (contract.quantity - contract.completed), 0);
        const canCompletePriority = highPriorityTotal <= printCapacity * monthsAvailable;
        if (canCompletePriority) {
            recommendations.push({
                type: 'success',
                icon: 'star',
                title: 'Contratti prioritari completabili',
                description: `Puoi completare tutti i contratti ad alta priorità dedicando il ${Math.round((highPriorityTotal / printCapacity) * 100)}% della capacità.`
            });
        } else {
            recommendations.push({
                type: 'warning',
                icon: 'star',
                title: 'Contratti prioritari a rischio',
                description: 'Anche concentrandoti sui contratti prioritari, potresti non riuscire a completarli tutti.'
            });
        }
    }
    if (capacityUsage > 80 && capacityUsage <= 100) {
        recommendations.push({
            type: 'warning',
            icon: 'clock',
            title: 'Capacità quasi al limite',
            description: 'Stai utilizzando oltre l\'80% della capacità. Considera di non accettare nuovi contratti.'
        });
    }
    if (activeContracts.length > 3) {
        recommendations.push({
            type: 'warning',
            icon: 'tasks',
            title: 'Molti contratti attivi',
            description: 'Hai molti contratti attivi. Concentrati su quelli prioritari per massimizzare l\'efficienza.'
        });
    }
    if (strategy === 'parallelo' || strategy === 'parallelo+sequenziale') {
        recommendations.push({
            type: 'info',
            icon: 'balance-scale',
            title: 'Strategia consigliata: Distribuzione',
            description: 'Distribuisci equamente la capacità tra tutti i contratti attivi: è la soluzione più efficiente in questo scenario.'
        });
    } else if (strategy === 'sequenziale') {
        recommendations.push({
            type: 'info',
            icon: 'stream',
            title: 'Strategia consigliata: Sequenziale',
            description: 'Lavora un contratto per volta (in ordine di scadenza/priorità): solo così riuscirai a completare tutti i contratti in tempo.'
        });
    }
    return recommendations;
}
