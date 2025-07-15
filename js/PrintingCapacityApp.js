import TimeManager from './timeManager.js';
import ContractManager from './contractManager.js';
import ProductionManager from './productionManager.js';
import UIManager from './uiManager.js';
import DataManager from './dataManager.js';
import SettingsManager from './settingsManager.js';
import EventManager from './eventManager.js';
import AnalysisManager from './analysisManager.js';

class PrintingCapacityApp {
    constructor() {
        this.timeManager = new TimeManager();
        this.contractManager = new ContractManager();
        this.productionManager = new ProductionManager();
        this.uiManager = new UIManager();
        this.analysisManager = new AnalysisManager();
        this.dataManager = new DataManager();
        this.settingsManager = new SettingsManager();
        this.eventManager = new EventManager();
        this.gameDate = null;
        this.gameHour = null;
        this.printCapacity = 0;
        this.init();
    }

    /**
     * Inizializza l'applicazione
     */
    init() {
        this.setupDateDropdowns();
        this.loadData();
        this.settingsManager.init(this);
        this.eventManager.init(this);
        this.updateDisplay();
    }

    setupDateDropdowns() { this.uiManager.setupDateDropdowns(); }

    /**
     * Salva le impostazioni con feedback visuale
     */
    saveSettings() {
        try {
            const success = this.settingsManager.saveSettings();
            if (success) {
                console.log('Impostazioni salvate:', {
                    gameDate: this.gameDate,
                    gameHour: this.gameHour,
                    printCapacity: this.printCapacity
                });
            }
            return success;
        } catch (error) {
            console.error('Errore durante il salvataggio delle impostazioni:', error);
            this.uiManager.showNotification('Errore durante il salvataggio delle impostazioni', 'danger');
            return false;
        }
    }

    advanceMonth() {
        if (!this.gameDate) {
            this.uiManager.showNotification('Prima configura la data di gioco', 'warning');
            return;
        }
        try {
            const timeResult = this.timeManager.advanceMonth(this.gameDate, this.gameHour);
            this.gameDate = timeResult.newDate;
            this.gameHour = timeResult.newHour;
            const contracts = this.contractManager.getContracts();
            const updatedContracts = this.productionManager.processMonthlyProduction(
                contracts,
                this.printCapacity,
                this.gameHour,
                this.timeManager
            );
            this.contractManager.updateContracts(updatedContracts);
            this.uiManager.updateGameDateDisplay(this.gameDate, this.gameHour);
            this.updateDisplay();
            this.saveData();
            this.uiManager.showNotification(
                `Avanzato al ${this.timeManager.formatDate(this.gameDate)} ore ${this.gameHour}:00`,
                'success'
            );
        } catch (error) {
            this.uiManager.showNotification(`Errore nell'avanzamento del mese: ${error.message}`, 'danger');
        }
    }

    addContract() {
        const contractData = this.uiManager.getContractFormData();
        if (!contractData) {
            this.uiManager.showNotification('Per favore, compila tutti i campi del contratto', 'warning');
            return;
        }
        if (!this.gameDate) {
            this.uiManager.showNotification('Prima configura la data di gioco nelle impostazioni', 'warning');
            return;
        }
        const contract = this.contractManager.addContract(contractData);
        this.uiManager.clearContractForm();
        this.updateDisplay();
        this.saveData();
        this.uiManager.showNotification('Contratto aggiunto con successo!', 'success');
    }

    checkContractFeasibility() {
        console.log('🔍 Metodo checkContractFeasibility chiamato');
        console.log('📋 Stato app per fattibilità:', {
            gameDate: this.gameDate,
            gameHour: this.gameHour,
            printCapacity: this.printCapacity
        });
        const contractData = this.uiManager.getContractFormData();
        console.log('📋 Dati contratto per controllo:', contractData);
        if (!contractData) {
            console.log('❌ Nessun dato contratto');
            this.uiManager.showNotification('Compila tutti i campi del contratto per controllare la fattibilità', 'warning');
            return;
        }
        if (!this.gameDate || !this.printCapacity) {
            console.log('❌ Impostazioni mancanti:', {
                gameDate: this.gameDate,
                printCapacity: this.printCapacity
            });
            this.uiManager.showNotification('Prima configura le impostazioni base', 'warning');
            return;
        }
        console.log('✅ Calcolando fattibilità completa...');
        const feasibilityResult = this.analysisManager.calculateContractFeasibility(
            contractData,
            this.gameDate,
            this.printCapacity,
            this.contractManager.getContracts(),
            this.timeManager,
            this.gameHour
        );
        console.log('📊 Risultato fattibilità completa:', feasibilityResult);
        this.uiManager.showFeasibilityResult(feasibilityResult, this.timeManager, this.printCapacity);
    }

    updateFeasibilityIndicator() {
        console.log('🔍 Controllo fattibilità contratto...');
        const contractData = this.uiManager.getContractFormData();
        console.log('📋 Dati contratto raccolti:', contractData);
        if (!contractData || !this.gameDate || !this.printCapacity) {
            console.log('❌ Dati mancanti per il controllo fattibilità:', {
                contractData: !!contractData,
                gameDate: !!this.gameDate,
                printCapacity: !!this.printCapacity
            });
            this.uiManager.hideFeasibilityIndicator();
            return;
        }
        console.log('✅ Calcolando fattibilità...');
        const feasibilityResult = this.analysisManager.calculateContractFeasibility(
            contractData,
            this.gameDate,
            this.printCapacity,
            this.contractManager.getContracts(),
            this.timeManager,
            this.gameHour
        );
        console.log('📊 Risultato fattibilità:', feasibilityResult);
        this.uiManager.updateFeasibilityIndicator(feasibilityResult);
    }

    removeContract(id) {
        const contract = this.contractManager.removeContract(id);
        if (contract) {
            this.updateDisplay();
            this.saveData();
            this.uiManager.showNotification('Contratto rimosso', 'success');
        }
    }

    editContract(id) {
        const contract = this.contractManager.getContractById(id);
        if (!contract) return;
        this.uiManager.showEditContractModal(contract, (updatedContract) => {
            this.contractManager.updateContract(id, updatedContract);
            this.updateDisplay();
            this.saveData();
            this.uiManager.showNotification('Contratto modificato con successo!', 'success');
        });
    }

    completeContract(id) {
        const contract = this.contractManager.completeContract(id);
        if (contract) {
            this.updateDisplay();
            this.saveData();
            this.uiManager.showNotification(`Contratto "${contract.name}" completato con successo!`, 'success');
        }
    }

    updateDisplay() {
        this.updateContractsList();
        this.updateAnalysis();
    }

    updateContractsList() {
        const contracts = this.contractManager.getContracts();
        console.log('📋 Aggiornamento lista contratti:', {
            numeroContratti: contracts.length,
            contratti: contracts
        });
        this.uiManager.updateContractsList(contracts, this.gameDate, this.printCapacity);
    }

    updateAnalysis() {
        console.log('📊 updateAnalysis chiamato:', {
            gameDate: this.gameDate,
            gameHour: this.gameHour,
            printCapacity: this.printCapacity
        });
        if (!this.gameDate || !this.printCapacity) {
            this.uiManager.showAnalysisPlaceholder();
            return;
        }
        const contracts = this.contractManager.getContracts();
        const analysis = this.analysisManager.calculateAnalysis(
            contracts,
            this.gameDate,
            this.printCapacity,
            this.timeManager,
            this.gameHour
        );
        this.uiManager.updateAnalysis(analysis);
    }

    toggleContractPriority(id) {
        const contract = this.contractManager.toggleContractPriority(id);
        if (contract) {
            this.updateDisplay();
            this.saveData();
            this.uiManager.showNotification('Priorità contratto aggiornata', 'success');
        }
    }

    saveData() {
        console.log('💾 Salvando dati dell\'app...');
        const contracts = this.contractManager.getContracts();
        const result = this.dataManager.saveData(this.gameDate, this.gameHour, this.printCapacity, contracts);
        console.log('✅ Dati salvati:', result);
        return result;
    }

    loadData() {
        console.log('📋 Caricamento dati...');
        const data = this.dataManager.loadData();
        if (data) {
            console.log('✅ Dati caricati:', data);
            this.gameDate = data.gameDate;
            this.gameHour = data.gameHour;
            this.printCapacity = data.printCapacity;
            if (data.contracts && Array.isArray(data.contracts)) {
                this.contractManager.setContracts(data.contracts);
                console.log(`📋 ${data.contracts.length} contratti caricati nel ContractManager`);
            }
            this.settingsManager.loadSettingsToForm(this.gameDate, this.gameHour, this.printCapacity);
            this.updateDisplay();
            console.log('✅ Dati caricati e applicati correttamente');
        } else {
            console.log('ℹ️ Nessun dato salvato trovato');
        }
    }

    exportData() {
        const data = this.dataManager.exportData(
            this.gameDate,
            this.gameHour,
            this.printCapacity,
            this.contractManager.getContracts()
        );
        this.dataManager.saveToServer(data);
    }

    importData() {
        this.dataManager.importData((data) => {
            if (data) {
                this.gameDate = data.gameDate;
                this.gameHour = data.gameHour;
                this.printCapacity = data.printCapacity;
                if (data.contracts && Array.isArray(data.contracts)) {
                    this.contractManager.setContracts(data.contracts);
                }
                this.settingsManager.loadSettingsToForm(this.gameDate, this.gameHour, this.printCapacity);
                this.updateDisplay();
                this.uiManager.showNotification('Dati importati con successo!', 'success');
            }
        });
    }

    clearAllData() {
        if (confirm('Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.')) {
            this.gameDate = null;
            this.gameHour = null;
            this.printCapacity = 0;
            this.contractManager.clearContracts();
            this.dataManager.clearAllData();
            this.settingsManager.resetSettings();
            this.updateDisplay();
            this.uiManager.showNotification('Tutti i dati sono stati cancellati', 'success');
        }
    }

    testSaveSettings() {
        console.log('🧪 Test salvataggio impostazioni...');
        console.log('Stato attuale app:', {
            gameDate: this.gameDate,
            gameHour: this.gameHour,
            printCapacity: this.printCapacity,
            hasSettingsManager: !!this.settingsManager,
            hasUIManager: !!this.uiManager,
            hasDataManager: !!this.dataManager
        });
        const result = this.saveSettings();
        console.log('Risultato test:', result ? '✅ Successo' : '❌ Fallito');
        return result;
    }

    testLoadData() {
        console.log('🧪 Test caricamento dati...');
        const localStorageData = localStorage.getItem('printingCapacityData');
        if (localStorageData) {
            console.log('✅ Dati trovati nel localStorage:', JSON.parse(localStorageData));
            this.loadData();
            console.log('📋 Stato app dopo caricamento:', {
                gameDate: this.gameDate,
                gameHour: this.gameHour,
                printCapacity: this.printCapacity,
                contracts: this.contractManager.getContracts()
            });
            this.uiManager.showNotification('✅ Test caricamento completato - controlla console', 'success', 3000);
        } else {
            console.log('❌ Nessun dato trovato nel localStorage');
            this.uiManager.showNotification('❌ Nessun dato trovato nel localStorage', 'warning', 3000);
        }
    }

    testLocalStorageSave() {
        console.log('🧪 Test completo salvataggio localStorage...');
        const before = localStorage.getItem('printingCapacityData');
        console.log('📋 Dati prima del salvataggio:', before ? JSON.parse(before) : 'Nessun dato');
        const result = this.settingsManager.saveSettings();
        const after = localStorage.getItem('printingCapacityData');
        console.log('📋 Dati dopo il salvataggio:', after ? JSON.parse(after) : 'Nessun dato');
        if (after && before !== after) {
            console.log('✅ Test superato: i dati sono stati salvati correttamente!');
            this.uiManager.showNotification('✅ Test superato: salvataggio funziona correttamente!', 'success', 3000);
        } else if (after) {
            console.log('ℹ️ Dati presenti nel localStorage (potrebbero essere già aggiornati)');
            this.uiManager.showNotification('ℹ️ Dati presenti nel localStorage', 'info', 2000);
        } else {
            console.log('❌ Test fallito: i dati potrebbero non essere stati salvati');
            this.uiManager.showNotification('❌ Test fallito: problema nel salvataggio', 'error', 3000);
        }
        return result;
    }

    loadSampleData() {
        console.log('📦 Caricamento dati di esempio...');
        try {
            this.gameDate = '2025-07';
            this.gameHour = 9;
            this.printCapacity = 168000;
            console.log('⚙️ Impostazioni di esempio impostate:', {
                gameDate: this.gameDate,
                gameHour: this.gameHour,
                printCapacity: this.printCapacity
            });
            this.settingsManager.loadSettingsToForm(this.gameDate, this.gameHour, this.printCapacity);
            this.contractManager.clearContracts();
            const sampleContracts = [
                {
                    name: 'snifferstop',
                    quantity: 298623,
                    deadline: '1999-02',
                    priority: 'normal',
                    completed: 0
                }
            ];
            sampleContracts.forEach(contractData => {
                this.contractManager.addContract(contractData);
            });
            this.saveData();
            this.updateDisplay();
            console.log('✅ Dati di esempio caricati con successo');
            this.uiManager.showNotification(
                `📦 Dati di esempio caricati! ${sampleContracts.length} contratti aggiunti con ora ${this.gameHour}:00.`,
                'success',
                4000
            );
        } catch (error) {
            console.error('❌ Errore caricamento dati di esempio:', error);
            this.uiManager.showNotification('❌ Errore durante il caricamento dei dati di esempio', 'error');
        }
    }

    debugPersistence() {
        console.log('🔍 === DEBUG PERSISTENZA ===');
        try {
            const localStorageData = localStorage.getItem('printingCapacityData');
            console.log('📋 Dati nel localStorage:', localStorageData ? JSON.parse(localStorageData) : 'Nessun dato');
            console.log('📋 Stato app corrente:', {
                gameDate: this.gameDate,
                gameHour: this.gameHour,
                printCapacity: this.printCapacity,
                numeroContratti: this.contractManager.getContracts().length,
                contratti: this.contractManager.getContracts()
            });
            console.log('💾 Test salvataggio...');
            const saveResult = this.saveData();
            console.log('Risultato salvataggio:', saveResult);
            console.log('📋 Test ricarica...');
            this.loadData();
            const message = `\n🔍 DEBUG PERSISTENZA COMPLETATO\n\n📋 LocalStorage: ${localStorageData ? 'Presente' : 'Vuoto'}\n📋 Contratti nell'app: ${this.contractManager.getContracts().length}\n📋 Data gioco: ${this.gameDate || 'Non impostata'}\n📋 Capacità stampa: ${this.printCapacity || 'Non impostata'}\n\nControlla la console per i dettagli completi.\n            `;
            this.uiManager.showNotification(message, 'info', 8000);
        } catch (error) {
            console.error('❌ Errore debug persistenza:', error);
            this.uiManager.showNotification(`❌ Errore debug: ${error.message}`, 'error');
        }
    }
}

export default PrintingCapacityApp;
