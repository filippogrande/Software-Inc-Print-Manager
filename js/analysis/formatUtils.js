// Funzioni di formattazione risultati

export function formatFeasibilityResult(result, timeManager) {
    const icon = result.feasible ? '✅' : '❌';
    let message = `${icon} Contratto "${result.name}"\n`;
    message += `📦 Quantità: ${result.quantity.toLocaleString()}\n`;
    message += `📅 Scadenza: ${timeManager.formatDate(result.deadline)}\n`;
    message += `⏰ Mesi disponibili: ${result.monthsAvailable}\n`;
    if (result.completionDate) {
        message += `🎯 Completamento previsto: ${timeManager.formatDate(result.completionDate)}\n`;
        const completionMonth = new Date(result.completionDate);
        const deadlineMonth = new Date(result.deadline);
        if (completionMonth <= deadlineMonth) {
            const monthsEarly = timeManager.getMonthsDifference(result.completionDate, result.deadline);
            if (monthsEarly > 0) {
                message += `⭐ In anticipo di ${monthsEarly} mesi!\n`;
            }
        } else {
            const monthsLate = timeManager.getMonthsDifference(result.deadline, result.completionDate);
            message += `⚠️ In ritardo di ${monthsLate} mesi\n`;
        }
    }
    message += `🔢 Capacità necessaria/mese: ${result.monthlyCapacityNeeded.toLocaleString()}\n\n`;
    if (result.monthlySchedule && result.monthlySchedule.length > 0) {
        message += `📊 DISTRIBUZIONE PRODUZIONE MENSILE:\n`;
        message += `${'='.repeat(50)}\n`;
        result.monthlySchedule.forEach(month => {
            const statusIcon = month.feasible ? '✅' : '❌';
            const loadBar = '█'.repeat(Math.min(Math.round(month.load / 10), 10));
            const emptyBar = '░'.repeat(10 - Math.min(Math.round(month.load / 10), 10));
            message += `${statusIcon} ${month.monthName}:\n`;
            message += `   Produzione: ${month.production.toLocaleString()}/${month.capacity.toLocaleString()} (${month.load}%)\n`;
            message += `   [${loadBar}${emptyBar}] ${month.load}%\n`;
            if (month.contracts.length > 0) {
                message += `   Contratti in produzione:\n`;
                month.contracts.forEach(contract => {
                    const priorityMark = contract.priority === 'high' ? ' ⭐' : '';
                    const remainingText = contract.remaining > 0 ? ` (rimangono ${contract.remaining.toLocaleString()})` : ' (COMPLETATO)';
                    message += `     • ${contract.name}: ${contract.production.toLocaleString()} copie${priorityMark}${remainingText}\n`;
                });
            }
            message += `\n`;
        });
    }
    if (result.feasible) {
        message += `🎉 FATTIBILE! Completamento entro la scadenza.`;
    } else {
        message += '⚠️ NON FATTIBILE! ';
        if (!result.soloFeasible) {
            message += `Il contratto richiede ${result.monthlyCapacityNeeded.toLocaleString()} unità/mese ma hai solo ${result.printCapacity ? result.printCapacity.toLocaleString() : 'N/A'} di capacità.`;
        } else if (result.completionDate) {
            message += `Il contratto sarà completato in ritardo (${timeManager.formatDate(result.completionDate)}).`;
        } else {
            message += `Impossibile completare il contratto con la capacità attuale.`;
        }
    }
    return message;
}
