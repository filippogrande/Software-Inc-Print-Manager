/**
 * Gestione degli eventi dell'applicazione
 */
class EventManager {
    constructor() {
        this.app = null;
    }

    /**
     * Inizializza il gestore eventi con un riferimento all'app principale
     */
    init(app) {
        console.log('🔗 Inizializzazione EventManager...');
        this.app = app;
        this.bindEvents();
        console.log('✅ EventManager inizializzato');
    }

    /**
     * Associa gli eventi ai controlli UI
     */
    bindEvents() {
        console.log('🔗 Binding eventi...');
        
        // Verifica che tutti i pulsanti esistano
        const buttons = [
            'saveSettings', 'advanceMonth', 'addContract', 'checkContract',
            'exportData', 'importData', 'clearData'
        ];
        
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                console.log(`✅ Trovato pulsante: ${buttonId}`);
            } else {
                console.log(`❌ Pulsante mancante: ${buttonId}`);
            }
        });
        
        // Salva impostazioni con feedback visuale immediato
        const saveButton = document.getElementById('saveSettings');
        if (saveButton) {
            saveButton.addEventListener('click', (e) => {
                const button = e.target;
                const originalText = button.innerHTML;
                
                // Feedback visuale immediato
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
                button.disabled = true;
                button.style.backgroundColor = '#ffc107';
                
                // Esegui il salvataggio
                setTimeout(() => {
                    const success = this.app.saveSettings();
                    
                    // Feedback visuale del risultato
                    if (success) {
                        button.innerHTML = '<i class="fas fa-check"></i> Salvato!';
                        button.style.backgroundColor = '#28a745';
                    } else {
                        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore';
                        button.style.backgroundColor = '#dc3545';
                    }
                    
                    // Ripristina il pulsante dopo un delay
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                        button.style.backgroundColor = '';
                    }, 2000);
                }, 100);
            });
        }

        // Avanza mese (solo se esiste)
        const advanceButton = document.getElementById('advanceMonth');
        if (advanceButton) {
            advanceButton.addEventListener('click', () => {
                this.app.advanceMonth();
            });
        }

        // Aggiungi contratto
        const addContractButton = document.getElementById('addContract');
        if (addContractButton) {
            addContractButton.addEventListener('click', () => {
                console.log('🔘 Pulsante "Aggiungi Contratto" cliccato');
                this.app.addContract();
            });
        }

        // Controlla fattibilità contratto
        const checkContractButton = document.getElementById('checkContract');
        if (checkContractButton) {
            checkContractButton.addEventListener('click', () => {
                console.log('🔘 Pulsante "Controlla Fattibilità" cliccato');
                this.app.checkContractFeasibility();
            });
        }

        // Gestione dati (solo se esistono)
        const exportButton = document.getElementById('exportData');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.app.exportData();
            });
        }

        const importButton = document.getElementById('importData');
        if (importButton) {
            importButton.addEventListener('click', () => {
                this.app.importData();
            });
        }

        const clearButton = document.getElementById('clearData');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.app.clearAllData();
            });
        }

        // Carica dati di esempio
        const loadSampleButton = document.getElementById('loadSampleData');
        if (loadSampleButton) {
            loadSampleButton.addEventListener('click', () => {
                console.log('🔘 Pulsante "Carica Dati di Esempio" cliccato');
                this.app.loadSampleData();
            });
        }

        // Debug persistenza
        const debugPersistenceButton = document.getElementById('debugPersistence');
        if (debugPersistenceButton) {
            debugPersistenceButton.addEventListener('click', () => {
                console.log('🔘 Pulsante "Debug Persistenza" cliccato');
                this.app.debugPersistence();
            });
        }

        // Auto-aggiorna analisi quando cambiano i dati (solo se esistono)
        ['gameMonth', 'gameYear', 'gameHour', 'printCapacity'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.app.updateAnalysis();
                });
            }
        });

        // Auto-aggiorna indicatore fattibilità contratto (solo se esistono)
        ['contractName', 'contractQuantity', 'contractMonth', 'contractYear'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => {
                    this.app.updateFeasibilityIndicator();
                });
                element.addEventListener('change', () => {
                    this.app.updateFeasibilityIndicator();
                });
            }
        });
    }

    /**
     * Rimuove tutti gli event listeners (per cleanup)
     */
    removeEventListeners() {
        // Implementa la rimozione degli event listeners se necessario
        // Questo è utile per evitare memory leaks se l'app viene ricreata
    }
}

export default EventManager;
