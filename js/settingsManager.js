/**
 * Gestione delle impostazioni dell'applicazione
 */
class SettingsManager {
    constructor() {
        this.app = null;
    }

    /**
     * Inizializza il gestore impostazioni con un riferimento all'app principale
     */
    init(app) {
        this.app = app;
    }

    /**
     * Raccoglie i dati delle impostazioni dai campi del form
     */
    getSettingsFromForm() {
        const gameMonthEl = document.getElementById('gameMonth');
        const gameYearEl = document.getElementById('gameYear');
        const gameHourEl = document.getElementById('gameHour');
        const printCapacityEl = document.getElementById('printCapacity');
        
        if (!gameMonthEl || !gameYearEl || !gameHourEl || !printCapacityEl) {
            console.error('❌ Elementi del form delle impostazioni non trovati');
            return null;
        }
        
        const gameMonth = gameMonthEl.value;
        const gameYear = gameYearEl.value;
        const gameHour = gameHourEl.value;
        const printCapacity = parseInt(printCapacityEl.value);

        return {
            gameMonth,
            gameYear,
            gameHour,
            printCapacity
        };
    }

    /**
     * Valida i dati delle impostazioni
     */
    validateSettings(settings) {
        const { gameMonth, gameYear, gameHour, printCapacity } = settings;
        
        if (!gameMonth || !gameYear || !gameHour || !printCapacity) {
            return {
                valid: false,
                message: 'Per favore, compila tutti i campi delle impostazioni'
            };
        }

        if (printCapacity <= 0) {
            return {
                valid: false,
                message: 'La capacità di stampa deve essere maggiore di zero'
            };
        }

        if (parseInt(gameHour) < 0 || parseInt(gameHour) > 23) {
            return {
                valid: false,
                message: 'L\'ora deve essere compresa tra 0 e 23'
            };
        }

        return { valid: true };
    }

    /**
     * Salva le impostazioni con validazione e feedback completo
     */
    saveSettings() {
        console.log('🔧 Inizio salvataggio impostazioni...');
        
        const settings = this.getSettingsFromForm();
        console.log('📋 Impostazioni raccolte dal form:', settings);
        
        const validation = this.validateSettings(settings);
        console.log('✔️ Risultato validazione:', validation);

        if (!validation.valid) {
            console.log('❌ Validazione fallita:', validation.message);
            this.app.uiManager.showNotification(`❌ ${validation.message}`, 'warning', 3000);
            return false;
        }

        // Aggiorna lo stato dell'app
        this.app.gameDate = `${settings.gameYear}-${settings.gameMonth}`;
        this.app.gameHour = parseInt(settings.gameHour);
        this.app.printCapacity = settings.printCapacity;
        
        console.log('📅 Stato app aggiornato:', {
            gameDate: this.app.gameDate,
            gameHour: this.app.gameHour,
            printCapacity: this.app.printCapacity
        });
        
        // Aggiorna i manager
        this.app.timeManager.gameDate = this.app.gameDate;
        this.app.timeManager.gameHour = this.app.gameHour;
        this.app.productionManager.printCapacity = this.app.printCapacity;
        
        // Salva i dati
        console.log('💾 Salvando dati...');
        try {
            const savedData = this.app.saveData();
            console.log('✅ Dati salvati correttamente:', savedData);
            
            // Verifica che i dati siano stati salvati in localStorage
            const verificaLocalStorage = localStorage.getItem('printingCapacityData');
            if (verificaLocalStorage) {
                const datiSalvati = JSON.parse(verificaLocalStorage);
                console.log('✅ Verifica localStorage completata:', datiSalvati);
            }
            
            // Aggiorna il display
            this.app.updateDisplay();
            
            // Mostra notifica di successo con informazioni dettagliate
            const now = new Date();
            const successMessage = `✅ Impostazioni salvate correttamente!\n📅 Data: ${this.app.timeManager.formatDate(this.app.gameDate)} ore ${this.app.gameHour}:00\n🖨️ Capacità: ${this.app.printCapacity.toLocaleString()} copie/mese\n💾 Salvato alle ${now.toLocaleTimeString()}`;
            this.app.uiManager.showNotification(successMessage, 'success', 5000);
            
            console.log('✅ Salvataggio completato con successo!');
            return true;
        } catch (error) {
            console.error('❌ Errore durante il salvataggio:', error);
            this.app.uiManager.showNotification('❌ Errore durante il salvataggio delle impostazioni', 'error', 3000);
            return false;
        }
    }

    /**
     * Carica le impostazioni nei campi del form
     */
    loadSettingsToForm(gameDate, gameHour, printCapacity) {
        const gameMonthEl = document.getElementById('gameMonth');
        const gameYearEl = document.getElementById('gameYear');
        const gameHourEl = document.getElementById('gameHour');
        const printCapacityEl = document.getElementById('printCapacity');
        
        if (!gameMonthEl || !gameYearEl || !gameHourEl || !printCapacityEl) {
            console.error('❌ Elementi del form delle impostazioni non trovati');
            return false;
        }
        
        if (gameDate) {
            const [year, month] = gameDate.split('-');
            gameYearEl.value = year;
            gameMonthEl.value = month;
        }
        
        if (gameHour !== null && gameHour !== undefined) {
            gameHourEl.value = gameHour.toString().padStart(2, '0');
        }
        
        if (printCapacity) {
            printCapacityEl.value = printCapacity;
        }
        
        return true;
    }

    /**
     * Resetta le impostazioni ai valori di default
     */
    resetSettings() {
        const gameMonthEl = document.getElementById('gameMonth');
        const gameYearEl = document.getElementById('gameYear');
        const gameHourEl = document.getElementById('gameHour');
        const printCapacityEl = document.getElementById('printCapacity');
        
        if (gameMonthEl) gameMonthEl.value = '';
        if (gameYearEl) gameYearEl.value = '';
        if (gameHourEl) gameHourEl.value = '';
        if (printCapacityEl) printCapacityEl.value = '';
    }
}

export default SettingsManager;
