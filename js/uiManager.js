/**
 * Gestione dell'interfaccia utente
 */
class UIManager {
    constructor() {
        this.notifications = [];
    }

    /**
     * Mostra una notifica
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'warning' ? 'exclamation' : 'info'}"></i>
            ${message}
        `;
        
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${colors[type]};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Mostra una notifica personalizzata con HTML
     */
    showCustomNotification(html, type = 'info', duration = 8000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} notification-large`;
        notification.innerHTML = html;
        
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1.5rem;
            background: ${colors[type]};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Mostra un modale dettagliato per la fattibilità
     */
    showDetailedNotification(message, type, feasible) {
        const modal = document.createElement('div');
        modal.className = 'feasibility-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header ${type}">
                    <h3>
                        <i class="fas fa-${feasible ? 'check-circle' : 'exclamation-triangle'}"></i>
                        Controllo Fattibilità
                    </h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <pre>${message}</pre>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-ok">OK</button>
                </div>
            </div>
        `;
        
        this.addModalStyles();
        document.body.appendChild(modal);
        
        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-ok').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        const escListener = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);
    }

    /**
     * Crea il modale di modifica contratto
     */
    createEditContractModal(contract, onSave, onCancel) {
        const modal = document.createElement('div');
        modal.className = 'edit-contract-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-edit"></i>
                        Modifica Contratto
                    </h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editContractName">Nome Contratto:</label>
                        <input type="text" id="editContractName" value="${contract.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="editContractQuantity">Quantità Totale:</label>
                        <input type="number" id="editContractQuantity" value="${contract.quantity}" min="1" required>
                    </div>
                    <div class="form-group">
                        <label for="editContractCompleted">Copie Già Prodotte:</label>
                        <input type="number" id="editContractCompleted" value="${contract.completed || 0}" min="0" required>
                    </div>
                    <div class="form-group">
                        <label for="editContractDeadline">Scadenza:</label>
                        <div class="date-inputs">
                            <select id="editContractMonth" required>
                                <option value="">Mese</option>
                                ${this.generateMonthOptions(contract.deadline)}
                            </select>
                            <select id="editContractYear" required>
                                <option value="">Anno</option>
                                ${this.generateYearOptions(contract.deadline)}
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editContractPriority">Priorità:</label>
                        <select id="editContractPriority" required>
                            <option value="normal" ${contract.priority === 'normal' ? 'selected' : ''}>Normale</option>
                            <option value="high" ${contract.priority === 'high' ? 'selected' : ''}>Alta</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" id="saveContractEdit">
                        <i class="fas fa-save"></i> Salva Modifiche
                    </button>
                    <button class="btn btn-secondary modal-cancel">
                        <i class="fas fa-times"></i> Annulla
                    </button>
                </div>
            </div>
        `;

        this.addEditModalStyles();
        document.body.appendChild(modal);

        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
            }
            if (onCancel) onCancel();
        };

        const saveChanges = () => {
            const formData = {
                name: modal.querySelector('#editContractName').value,
                quantity: parseInt(modal.querySelector('#editContractQuantity').value),
                completed: parseInt(modal.querySelector('#editContractCompleted').value),
                deadline: `${modal.querySelector('#editContractYear').value}-${modal.querySelector('#editContractMonth').value}`,
                priority: modal.querySelector('#editContractPriority').value
            };

            if (onSave(formData)) {
                closeModal();
            }
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
        modal.querySelector('#saveContractEdit').addEventListener('click', saveChanges);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        const escListener = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);

        return modal;
    }

    /**
     * Genera le opzioni per i mesi
     */
    generateMonthOptions(deadline) {
        const months = [
            { value: '01', name: 'Gennaio' },
            { value: '02', name: 'Febbraio' },
            { value: '03', name: 'Marzo' },
            { value: '04', name: 'Aprile' },
            { value: '05', name: 'Maggio' },
            { value: '06', name: 'Giugno' },
            { value: '07', name: 'Luglio' },
            { value: '08', name: 'Agosto' },
            { value: '09', name: 'Settembre' },
            { value: '10', name: 'Ottobre' },
            { value: '11', name: 'Novembre' },
            { value: '12', name: 'Dicembre' }
        ];

        const currentMonth = deadline ? deadline.split('-')[1] : '';
        
        return months.map(month => 
            `<option value="${month.value}" ${month.value === currentMonth ? 'selected' : ''}>${month.name}</option>`
        ).join('');
    }

    /**
     * Genera le opzioni per gli anni con il range completo del gioco
     */
    generateYearOptions(deadline) {
        const currentYear = deadline ? deadline.split('-')[0] : '';
        let options = '';
        
        // Usa lo stesso range del gioco principale (1980-2100)
        for (let year = 1980; year <= 2100; year++) {
            const selected = year.toString() === currentYear ? 'selected' : '';
            options += `<option value="${year}" ${selected}>${year}</option>`;
        }
        
        return options;
    }

    /**
     * Configura i dropdown delle date (anni) per il gioco e il form contratti
     */
    setupDateDropdowns() {
        // Popola il dropdown dell'anno di gioco
        const gameYearSelect = document.getElementById('gameYear');
        if (gameYearSelect) {
            // Popola gli anni per l'intero range del gioco (1980-2100)
            for (let year = 1980; year <= 2100; year++) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                gameYearSelect.appendChild(option);
            }
        }

        // Popola il dropdown dell'anno per i contratti
        const contractYearSelect = document.getElementById('contractYear');
        if (contractYearSelect) {
            // Pulisce eventuali opzioni esistenti (tranne il placeholder)
            const placeholder = contractYearSelect.querySelector('option[value=""]');
            contractYearSelect.innerHTML = '';
            if (placeholder) {
                contractYearSelect.appendChild(placeholder);
            } else {
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = 'Anno';
                contractYearSelect.appendChild(placeholderOption);
            }

            // Popola gli anni per l'intero range del gioco (1980-2100)
            for (let year = 1980; year <= 2100; year++) {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                contractYearSelect.appendChild(option);
            }
        }
    }

    /**
     * Aggiorna il display della data di gioco nell'interfaccia
     */
    updateGameDateDisplay(gameDate, gameHour) {
        const [year, month] = gameDate.split('-');
        document.getElementById('gameYear').value = year;
        document.getElementById('gameMonth').value = month;
        document.getElementById('gameHour').value = gameHour.toString().padStart(2, '0');
    }

    /**
     * Aggiunge gli stili per i modali
     */
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;

        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .feasibility-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header.success {
                background: #dcfce7;
                color: #166534;
            }
            
            .modal-header.danger {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .modal-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
            }
            
            .modal-close:hover {
                opacity: 1;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-body pre {
                white-space: pre-wrap;
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 0;
                color: #374151;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 0.75rem;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        
        document.head.appendChild(modalStyles);
    }

    /**
     * Aggiunge gli stili per il modale di modifica
     */
    addEditModalStyles() {
        if (document.getElementById('edit-modal-styles')) return;

        const editModalStyles = document.createElement('style');
        editModalStyles.id = 'edit-modal-styles';
        editModalStyles.textContent = `
            .edit-contract-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .edit-contract-modal .modal-header {
                background: #f8fafc;
            }
            
            .edit-contract-modal .modal-header h3 {
                color: #374151;
            }
            
            .edit-contract-modal .modal-close {
                color: #6b7280;
            }
            
            .edit-contract-modal .modal-footer {
                background: #f8fafc;
            }
            
            .btn-secondary {
                background: #6b7280;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }
            
            .btn-secondary:hover {
                background: #4b5563;
            }
        `;
        
        document.head.appendChild(editModalStyles);
    }

    /**
     * Aggiunge gli stili per le animazioni
     */
    static addAnimationStyles() {
        if (document.getElementById('animation-styles')) return;

        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animationStyles);
    }

    /**
     * Mostra il risultato della verifica di fattibilità
     */
    showFeasibilityResult(result, timeManager, printCapacity) {
        const icon = result.feasible ? '✅' : '❌';
        const type = result.feasible ? 'success' : 'danger';
        
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
        
        // Mostra la distribuzione mensile
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
                message += `Il contratto richiede ${result.monthlyCapacityNeeded.toLocaleString()} unità/mese ma hai solo ${printCapacity.toLocaleString()} di capacità.`;
            } else if (result.completionDate) {
                message += `Il contratto sarà completato in ritardo (${timeManager.formatDate(result.completionDate)}).`;
            } else {
                message += `Impossibile completare il contratto con la capacità attuale.`;
            }
        }
        
        // Mostra in un alert più dettagliato
        this.showDetailedNotification(message, type, result.feasible);
    }

    /**
     * Mostra una notifica dettagliata con modale
     */
    showDetailedNotification(message, type, feasible) {
        // Crea un modale personalizzato
        const modal = document.createElement('div');
        modal.className = 'feasibility-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header ${type}">
                    <h3>
                        <i class="fas fa-${feasible ? 'check-circle' : 'exclamation-triangle'}"></i>
                        Controllo Fattibilità
                    </h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <pre>${message}</pre>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary modal-ok">OK</button>
                </div>
            </div>
        `;
        
        // Aggiungi stili per il modale
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .feasibility-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header.success {
                background: #dcfce7;
                color: #166534;
            }
            
            .modal-header.danger {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .modal-header h3 {
                margin: 0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
            }
            
            .modal-close:hover {
                opacity: 1;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-body pre {
                white-space: pre-wrap;
                font-family: 'Inter', sans-serif;
                font-size: 0.9rem;
                line-height: 1.6;
                margin: 0;
                color: #374151;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
            }
        `;
        
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Event listeners per chiudere il modale
        const closeModal = () => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        };
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-ok').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Chiudi con ESC
        const escListener = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);
    }

    /**
     * Aggiorna la lista dei contratti nell'interfaccia
     */
    updateContractsList(contracts, gameDate, printCapacity) {
        console.log('🔄 UIManager.updateContractsList chiamato con:', {
            numeroContratti: contracts?.length || 0,
            gameDate,
            printCapacity
        });
        
        const contractsList = document.getElementById('contractsList');
        
        if (!contractsList) {
            console.log('⚠️ Elemento contractsList non trovato');
            return;
        }
        
        console.log('✅ Elemento contractsList trovato');
        
        if (!contracts || contracts.length === 0) {
            console.log('📋 Nessun contratto da mostrare');
            contractsList.innerHTML = `
                <div class="no-contracts">
                    <i class="fas fa-inbox"></i>
                    <p>Nessun contratto attivo</p>
                </div>
            `;
            return;
        }

        console.log(`📋 Aggiornamento UI con ${contracts.length} contratti`);
        
        const contractsHtml = contracts.map(contract => {
            // Assicura che il contratto abbia il campo completed
            if (!contract.hasOwnProperty('completed')) {
                contract.completed = 0;
            }
            
            const completionPercentage = Math.round((contract.completed / contract.quantity) * 100);
            const status = this.getContractStatus(contract, gameDate, printCapacity);
            
            return `
                <div class="contract-item">
                    <div class="contract-header">
                        <div class="contract-name">${contract.name}</div>
                        <div class="contract-status status-${status.type}">${status.text}</div>
                    </div>
                    <div class="contract-details">
                        <strong>Quantità:</strong> ${contract.quantity.toLocaleString()} copie<br>
                        <strong>Completato:</strong> ${contract.completed.toLocaleString()} copie (${completionPercentage}%)<br>
                        <strong>Rimanente:</strong> ${(contract.quantity - contract.completed).toLocaleString()} copie<br>
                        <strong>Scadenza:</strong> ${this.formatDate(contract.deadline)}<br>
                        <strong>Priorità:</strong> ${contract.priority === 'high' ? 'Alta' : 'Normale'}
                    </div>
                    <div class="contract-progress">
                        <div class="contract-progress-bar" style="width: ${completionPercentage}%"></div>
                    </div>
                    <div class="contract-actions">
                        <button class="btn btn-small ${contract.priority === 'high' ? 'btn-warning' : 'btn-primary'}" 
                                onclick="manager.toggleContractPriority(${contract.id})">
                            <i class="fas fa-star"></i> 
                            ${contract.priority === 'high' ? 'Rimuovi Priorità' : 'Priorità Alta'}
                        </button>
                        <button class="btn btn-small btn-primary" onclick="manager.editContract(${contract.id})">
                            <i class="fas fa-edit"></i> Modifica
                        </button>
                        <button class="btn btn-small btn-success" onclick="manager.completeContract(${contract.id})">
                            <i class="fas fa-check"></i> Completa
                        </button>
                        <button class="btn btn-small btn-danger" onclick="manager.removeContract(${contract.id})">
                            <i class="fas fa-trash"></i> Rimuovi
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        contractsList.innerHTML = contractsHtml;
    }

    /**
     * Aggiorna l'analisi nell'interfaccia
     */
    updateAnalysis(analysis) {
        const analysisResult = document.getElementById('analysisResult');
        if (!analysisResult) {
            console.log('⚠️ Elemento analysisResult non trovato');
            return;
        }

        // Determina la strategia consigliata
        const recommendedStrategy = analysis.strategy;
        const hasSequential = analysis.sequential && analysis.sequential.monthlySchedule && analysis.sequential.monthlySchedule.length > 0;
        const hasParallel = analysis.monthlySchedule && analysis.monthlySchedule.length > 0;

        // Helper per tabella schedule
        const renderScheduleTable = (schedule, label, highlight) => `
            <div class="monthly-schedule-section${highlight ? ' recommended' : ''}">
                <h3><i class="fas fa-calendar-alt"></i> Distribuzione Carico Mensile (${label})
                    ${highlight ? '<span class="recommended-badge">Metodo Consigliato</span>' : ''}
                </h3>
                <div class="monthly-schedule-table">
                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th>Mese</th>
                                <th>Produzione</th>
                                <th>Carico</th>
                                <th>Stato</th>
                                <th>Contratti</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${schedule.map(month => `
                                <tr class="schedule-row ${month.feasible ? 'feasible' : 'not-feasible'}">
                                    <td class="month-cell">
                                        <strong>${month.monthName}</strong>
                                    </td>
                                    <td class="production-cell">
                                        ${month.production.toLocaleString()} / ${month.capacity.toLocaleString()}
                                    </td>
                                    <td class="load-cell">
                                        <div class="load-indicator">
                                            <div class="load-bar">
                                                <div class="load-fill" style="width: ${Math.min(month.load, 100)}%; background-color: ${month.load > 100 ? '#dc3545' : month.load > 80 ? '#ffc107' : '#28a745'}"></div>
                                            </div>
                                            <span class="load-text">${month.load}%</span>
                                        </div>
                                    </td>
                                    <td class="status-cell">
                                        <span class="status-badge ${month.feasible ? 'status-ok' : 'status-overload'}">
                                            <i class="fas fa-${month.feasible ? 'check' : 'exclamation-triangle'}"></i>
                                            ${month.feasible ? 'OK' : 'SOVRACCARICO'}
                                        </span>
                                    </td>
                                    <td class="contracts-cell">
                                        <div class="contracts-in-month">
                                            ${month.contracts.map(contract => `
                                                <div class="contract-item ${contract.priority}">
                                                    <span class="contract-name">${contract.name}</span>
                                                    <span class="contract-production">${contract.production.toLocaleString()}</span>
                                                    ${contract.priority === 'high' ? '<i class="fas fa-star priority-star"></i>' : ''}
                                                </div>
                                            `).join('')}
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Box strategia consigliata
        const strategyBox = `
            <div class="strategy-box">
                <i class="fas fa-lightbulb"></i>
                <span>Metodo consigliato: <strong>${
                    typeof recommendedStrategy === 'string' && recommendedStrategy.length > 0
                        ? (recommendedStrategy.charAt(0).toUpperCase() + recommendedStrategy.slice(1))
                        : 'Nessuna strategia disponibile'
                }</strong></span>
            </div>
        `;

        // Riepilogo
        const summaryHtml = `
            <div class="analysis-summary">
                <div class="analysis-stat">
                    <div class="analysis-stat-value">${analysis.totalQuantity.toLocaleString()}</div>
                    <div class="analysis-stat-label">Copie Totali</div>
                </div>
                <div class="analysis-stat">
                    <div class="analysis-stat-value">${analysis.capacityUsage}%</div>
                    <div class="analysis-stat-label">Utilizzo Capacità</div>
                </div>
                <div class="analysis-stat">
                    <div class="analysis-stat-value">${analysis.monthsNeeded}</div>
                    <div class="analysis-stat-label">Mesi Necessari</div>
                </div>
                <div class="analysis-stat">
                    <div class="analysis-stat-value">${analysis.feasible ? 'SÌ' : 'NO'}</div>
                    <div class="analysis-stat-label">Fattibile</div>
                </div>
            </div>
        `;

        // Schedules: mostra SOLO la strategia consigliata
        let schedulesHtml = '';
        if (recommendedStrategy === 'sequenziale' && hasSequential) {
            schedulesHtml = renderScheduleTable(analysis.sequential.monthlySchedule, 'Sequenziale', true);
        } else if (recommendedStrategy === 'parallelo' && hasParallel) {
            schedulesHtml = renderScheduleTable(analysis.monthlySchedule, 'Parallelo', true);
        }

        // Raccomandazioni
        const recommendationsHtml = `
            <div class="analysis-recommendations">
                <h3><i class="fas fa-lightbulb"></i> Raccomandazioni</h3>
                ${analysis.recommendations.map(rec => `
                    <div class="recommendation">
                        <i class="fas fa-${rec.icon} recommendation-icon ${rec.type}"></i>
                        <div class="recommendation-content">
                            <h4>${rec.title}</h4>
                            <p>${rec.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Stili aggiuntivi per confronto strategie
        if (!document.getElementById('strategy-compare-styles')) {
            const style = document.createElement('style');
            style.id = 'strategy-compare-styles';
            style.textContent = `
                .strategy-box {
                    background: #f8fafc;
                    border-left: 6px solid #10b981;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    border-radius: 8px;
                }
                .recommended-badge {
                    background: #10b981;
                    color: #fff;
                    font-size: 0.9em;
                    padding: 0.2em 0.7em;
                    border-radius: 6px;
                    margin-left: 1em;
                }
                .schedule-compare {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2rem;
                }
                .monthly-schedule-section {
                    flex: 1 1 350px;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 1rem;
                    background: #fff;
                }
                .monthly-schedule-section.recommended {
                    border-color: #10b981;
                    box-shadow: 0 0 0 2px #10b98133;
                }
            `;
            document.head.appendChild(style);
        }

        analysisResult.innerHTML = `
            ${strategyBox}
            ${summaryHtml}
            ${schedulesHtml}
            ${recommendationsHtml}
        `;
    }

    /**
     * Mostra placeholder per l'analisi
     */
    showAnalysisPlaceholder() {
        const analysisResult = document.getElementById('analysisResult');
        
        if (!analysisResult) {
            console.log('⚠️ Elemento analysisResult non trovato');
            return;
        }
        
        analysisResult.innerHTML = `
            <div class="analysis-placeholder">
                <i class="fas fa-lightbulb"></i>
                <p>Configura le impostazioni e aggiungi contratti per vedere l'analisi</p>
            </div>
        `;
    }

    /**
     * Ottieni lo stato di un contratto
     */
    getContractStatus(contract, gameDate, printCapacity) {
        // Assicura che il contratto abbia il campo completed
        if (!contract.hasOwnProperty('completed')) {
            contract.completed = 0;
        }
        
        const now = new Date(gameDate);
        const deadline = new Date(contract.deadline);
        const monthsLeft = this.getMonthsDifference(now, deadline);
        const remaining = contract.quantity - contract.completed;
        const monthsNeeded = Math.ceil(remaining / printCapacity);
        
        if (contract.completed >= contract.quantity) {
            return { type: 'ok', text: 'Completato' };
        } else if (monthsNeeded > monthsLeft) {
            return { type: 'danger', text: 'A rischio' };
        } else if (monthsNeeded === monthsLeft) {
            return { type: 'warning', text: 'Stretto' };
        } else {
            return { type: 'ok', text: 'Fattibile' };
        }
    }

    /**
     * Calcola la differenza in mesi tra due date
     */
    getMonthsDifference(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    }

    /**
     * Formatta una data nel formato leggibile
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                       'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    /**
     * Ottieni i dati dal form del contratto
     */
    getContractFormData() {
        const name = document.getElementById('contractName').value.trim();
        const quantity = parseInt(document.getElementById('contractQuantity').value);
        const deadlineMonth = document.getElementById('contractMonth').value;
        const deadlineYear = document.getElementById('contractYear').value;
        const priority = document.getElementById('contractPriority').value;

        console.log('📝 Dati form contratto:', {
            name,
            quantity,
            deadlineMonth,
            deadlineYear,
            priority
        });

        if (!name || !quantity || !deadlineMonth || !deadlineYear || !priority) {
            console.log('❌ Dati form incompleti');
            return null;
        }

        if (quantity <= 0) {
            console.log('❌ Quantità non valida');
            return null;
        }

        const contractData = {
            name: name,
            quantity: quantity,
            deadline: `${deadlineYear}-${deadlineMonth}`,
            priority: priority,
            completed: 0
        };

        console.log('✅ Dati contratto validati:', contractData);
        return contractData;
    }

    /**
     * Pulisce il form del contratto
     */
    clearContractForm() {
        document.getElementById('contractName').value = '';
        document.getElementById('contractQuantity').value = '';
        document.getElementById('contractMonth').value = '';
        document.getElementById('contractYear').value = '';
        document.getElementById('contractPriority').value = 'normal';
    }

    /**
     * Nasconde l'indicatore di fattibilità
     */
    hideFeasibilityIndicator() {
        const indicator = document.getElementById('feasibilityIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    /**
     * Aggiorna l'indicatore di fattibilità
     */
    updateFeasibilityIndicator(feasibilityResult) {
        console.log('🎯 Aggiornamento indicatore fattibilità:', feasibilityResult);
        const indicator = document.getElementById('feasibilityIndicator');
        if (indicator) {
            indicator.style.display = 'block';
            indicator.className = `feasibility-indicator ${feasibilityResult.feasible ? 'feasible' : 'not-feasible'}`;
            let label = 'Non fattibile';
            if (feasibilityResult.strategy === 'parallelo+sequenziale') {
                label = 'Fattibile (parallelo o sequenziale)';
            } else if (feasibilityResult.strategy === 'parallelo') {
                label = 'Fattibile (parallelo)';
            } else if (feasibilityResult.strategy === 'sequenziale') {
                label = 'Fattibile (sequenziale)';
            }
            indicator.innerHTML = `
                <i class="fas fa-${feasibilityResult.feasible ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${label}
            `;
            console.log('✅ Indicatore aggiornato:', indicator.innerHTML);
        } else {
            console.log('❌ Elemento feasibilityIndicator non trovato');
        }
    }

    /**
     * Mostra il modale di modifica per un contratto
     */
    showEditContractModal(contract, onSave) {
        this.createEditContractModal(contract, (updatedContract) => {
            if (onSave(updatedContract)) {
                return true;
            }
            return false;
        });
    }
}

// Inizializza gli stili per le animazioni
UIManager.addAnimationStyles();

// Esporta la classe per l'uso in altri file
export default UIManager;
