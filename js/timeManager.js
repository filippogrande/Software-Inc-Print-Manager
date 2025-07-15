/**
 * Gestione del tempo e degli orari
 */
class TimeManager {
    constructor() {
        this.gameDate = null;
        this.gameHour = null;
    }

    /**
     * Calcola la differenza tra due date in mesi
     */
    getMonthsDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    }

    /**
     * Formatta una data in formato italiano
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
    }

    /**
     * Restituisce il numero di ore totali del mese di una data
     */
    getMaxMonthHours(date) {
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-based
        // Ottieni il numero di giorni nel mese
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return 24;
    }

    /**
     * Calcola la produzione parziale basata sull'orario di inizio e le ore totali del mese
     */
    getPartialMonthProduction(startHour, maxMonthHours) {
        if (startHour >= maxMonthHours) return 0;
        return (maxMonthHours - startHour) / maxMonthHours;
    }

    /**
     * Calcola il cambiamento temporale tra due date/ore
     */
    calculateTimeChange(oldDate, oldHour, newDate, newHour) {
        const oldDateTime = new Date(oldDate);
        oldDateTime.setHours(oldHour);
        
        const newDateTime = new Date(newDate);
        newDateTime.setHours(newHour);
        
        const timeDiff = newDateTime.getTime() - oldDateTime.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        
        const monthsPassed = this.getMonthsDifference(oldDate, newDate);
        
        return {
            hoursPassed: hoursDiff,
            monthsPassed: monthsPassed,
            direction: timeDiff >= 0 ? 'forward' : 'backward'
        };
    }

    /**
     * Avanza la data di gioco di un mese
     */
    advanceGameDate(currentDate) {
        const [year, month] = currentDate.split('-');
        const currentMonth = parseInt(month);
        const currentYear = parseInt(year);
        
        let newMonth = currentMonth + 1;
        let newYear = currentYear;
        
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        
        return {
            date: `${newYear}-${newMonth.toString().padStart(2, '0')}`,
            hour: 4 // Imposta automaticamente alle 4:00
        };
    }

    /**
     * Avanza il mese completo con calcolo ore e validazione
     */
    advanceMonth(gameDate, gameHour) {
        if (!gameDate) {
            throw new Error('Data di gioco non configurata');
        }

        // Calcola la nuova data (mese successivo)
        const advancement = this.advanceGameDate(gameDate);
        
        // Calcola le ore totali passate (da gameHour del mese precedente alle 4:00 del mese successivo)
        const hoursInMonth = 24 * 30; // 720 ore in un mese
        const hoursFromStartOfMonth = gameHour; // ore già passate nel mese precedente
        const remainingHoursInMonth = hoursInMonth - hoursFromStartOfMonth; // ore rimanenti nel mese precedente
        const hoursAdvanced = remainingHoursInMonth + advancement.hour; // ore rimanenti + ore del nuovo mese
        
        return {
            newDate: advancement.date,
            newHour: advancement.hour,
            hoursAdvanced: hoursAdvanced,
            monthsAdvanced: 1
        };
    }

    /**
     * Processa l'avanzamento temporale
     */
    processTimeAdvancement(timeChange, contracts, printCapacity, productionProcessor) {
        if (timeChange.direction === 'backward') {
            return {
                type: 'warning',
                message: 'Attenzione: Hai spostato il tempo indietro. I contratti potrebbero mostrare stato inconsistente.'
            };
        }

        if (timeChange.monthsPassed > 0) {
            // Simula la produzione per i mesi passati
            for (let i = 0; i < timeChange.monthsPassed; i++) {
                if (contracts.some(c => c.completed < c.quantity)) {
                    productionProcessor.processMonth(contracts, printCapacity);
                }
            }
            
            return {
                type: 'info',
                message: `Simulata produzione per ${timeChange.monthsPassed} mesi. Contratti aggiornati automaticamente.`
            };
        }

        return null;
    }
}

export default TimeManager;
