/**
 * Gestione dei dati (salvataggio, caricamento, import/export)
 */
class DataManager {
    constructor() {}

    /**
     * Salva i dati nel localStorage
     */
    saveToLocalStorage(gameDate, gameHour, printCapacity, contracts) {
        const data = {
            gameDate: gameDate,
            gameHour: gameHour,
            printCapacity: printCapacity,
            contracts: contracts,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('printingCapacityData', JSON.stringify(data));
        return data;
    }

    /**
     * Carica i dati dal localStorage
     */
    loadData() {
        try {
            const savedData = localStorage.getItem('printingCapacityData');
            if (savedData) {
                const data = JSON.parse(savedData);
                console.log('📋 Dati caricati dal localStorage:', data);
                return data;
            }
            console.log('📋 Nessun dato trovato nel localStorage');
            return null;
        } catch (error) {
            console.error('❌ Errore nel caricamento dati:', error);
            return null;
        }
    }

    /**
     * Valida i dati importati
     */
    validateImportData(data) {
        if (!data || typeof data !== 'object') return false;
        
        if (!data.hasOwnProperty('gameDate') || !data.hasOwnProperty('printCapacity')) {
            return false;
        }
        
        if (data.contracts && Array.isArray(data.contracts)) {
            for (const contract of data.contracts) {
                if (!contract.id || !contract.name || !contract.quantity || !contract.deadline) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Salva i dati nel localStorage
     */
    saveData(gameDate, gameHour, printCapacity, contracts) {
        const data = {
            gameDate: gameDate,
            gameHour: gameHour,
            printCapacity: printCapacity,
            contracts: contracts,
            lastSaved: new Date().toISOString()
        };
        
        try {
            // Salva nel localStorage
            localStorage.setItem('printingCapacityData', JSON.stringify(data));
            console.log('💾 Dati salvati nel localStorage:', data);
            return data;
        } catch (error) {
            console.error('❌ Errore nel salvataggio localStorage:', error);
            throw error;
        }
    }

    /**
     * Salva i dati nel localStorage E li esporta come file JSON
     */
    saveAndExportData(gameDate, gameHour, printCapacity, contracts) {
        const data = this.saveData(gameDate, gameHour, printCapacity, contracts);
        
        // Esporta anche come file JSON
        this.downloadJSON(data, 'printing-capacity-data.json');
        
        return data;
    }

    /**
     * Download dei dati come file JSON
     */
    downloadJSON(data, filename) {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Esporta i dati
     */
    exportData(gameDate, gameHour, printCapacity, contracts) {
        const data = {
            gameDate: gameDate,
            gameHour: gameHour,
            printCapacity: printCapacity,
            contracts: contracts,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        return data;
    }

    /**
     * Tenta il salvataggio sul server
     */
    async saveToServer(data) {
        try {
            const response = await fetch('/save-json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (result.success) {
                return { success: true, filename: result.filename };
            } else {
                throw new Error(result.error || 'Errore durante il salvataggio');
            }
        } catch (error) {
            console.error('Errore salvataggio server:', error);
            // Fallback: download del file
            this.downloadJSON(data, `printing-capacity-backup-${new Date().toISOString().split('T')[0]}.json`);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gestisce l'import di un file JSON
     */
    importData(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Valida i dati
                        if (this.validateImportData(data)) {
                            callback({ success: true, data: data });
                        } else {
                            callback({ success: false, error: 'File JSON non valido o corrotto' });
                        }
                    } catch (error) {
                        callback({ success: false, error: 'Errore nella lettura del file JSON' });
                    }
                };
                reader.readAsText(file);
            }
        };
        
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    /**
     * Pulisce tutti i dati dal localStorage
     */
    clearAllData() {
        localStorage.removeItem('printingCapacityData');
    }

    /**
     * Processa i dati importati per compatibilità
     */
    processImportedData(data) {
        // Aggiunge gameHour se mancante (per compatibilità con versioni precedenti)
        if (data.gameHour === undefined || data.gameHour === null) {
            data.gameHour = 4; // Default alle 4:00
        }

        // Assicura che tutti i contratti abbiano il campo completed
        if (data.contracts && Array.isArray(data.contracts)) {
            data.contracts.forEach(contract => {
                if (!contract.hasOwnProperty('completed')) {
                    contract.completed = 0;
                }
                if (!contract.hasOwnProperty('priority')) {
                    contract.priority = 'normal';
                }
            });
        }

        return data;
    }
}

export default DataManager;
