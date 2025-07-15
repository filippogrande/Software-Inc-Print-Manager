/**
 * Gestione dei contratti
 */
class ContractManager {
    constructor() {
        this.contracts = [];
    }

    /**
     * Aggiunge un nuovo contratto
     */
    addContract(contractData) {
        const contract = {
            id: Date.now(),
            name: contractData.name,
            quantity: contractData.quantity,
            deadline: contractData.deadline,
            completed: 0,
            priority: contractData.priority || 'normal',
            status: 'active'
        };

        this.contracts.push(contract);
        return contract;
    }

    /**
     * Rimuove un contratto
     */
    removeContract(id) {
        const contract = this.contracts.find(c => c.id === id);
        this.contracts = this.contracts.filter(c => c.id !== id);
        return contract;
    }

    /**
     * Completa un contratto
     */
    completeContract(id) {
        const contract = this.contracts.find(c => c.id === id);
        if (contract) {
            this.contracts = this.contracts.filter(c => c.id !== id);
            return contract;
        }
        return null;
    }

    /**
     * Modifica la priorità di un contratto
     */
    toggleContractPriority(id) {
        const contract = this.contracts.find(c => c.id === id);
        if (contract) {
            contract.priority = contract.priority === 'high' ? 'normal' : 'high';
            return contract;
        }
        return null;
    }

    /**
     * Modifica un contratto
     */
    editContract(id, newData) {
        const contract = this.contracts.find(c => c.id === id);
        if (contract) {
            contract.name = newData.name;
            contract.quantity = newData.quantity;
            contract.completed = newData.completed;
            contract.deadline = newData.deadline;
            contract.priority = newData.priority;
            return contract;
        }
        return null;
    }

    /**
     * Aggiorna tutti i contratti
     */
    updateContracts(contracts) {
        this.contracts = contracts || [];
        return this.contracts;
    }

    /**
     * Ottiene un contratto per ID
     */
    getContractById(id) {
        return this.contracts.find(c => c.id === id);
    }

    /**
     * Aggiorna un contratto esistente
     */
    updateContract(id, newData) {
        const contract = this.contracts.find(c => c.id === id);
        if (contract) {
            Object.assign(contract, newData);
            return contract;
        }
        return null;
    }

    /**
     * Ottiene tutti i contratti
     */
    getContracts() {
        return this.contracts;
    }

    /**
     * Ottiene i contratti attivi
     */
    getActiveContracts() {
        return this.contracts.filter(contract => {
            if (!contract.hasOwnProperty('completed')) {
                contract.completed = 0;
            }
            return contract.completed < contract.quantity;
        });
    }

    /**
     * Ottiene i contratti ad alta priorità
     */
    getHighPriorityContracts() {
        return this.contracts.filter(c => c.priority === 'high' && c.completed < c.quantity);
    }

    /**
     * Imposta la lista dei contratti con validazione
     */
    setContracts(contracts) {
        if (!contracts || !Array.isArray(contracts)) {
            this.contracts = [];
            return;
        }
        
        // Valida e corregge ogni contratto
        this.contracts = contracts.map(contract => {
            // Crea una copia del contratto per evitare di modificare l'originale
            const validatedContract = { ...contract };
            
            // Valida e correggi le proprietà mancanti
            if (!validatedContract.hasOwnProperty('id') || !validatedContract.id) {
                validatedContract.id = Date.now() + Math.random();
            }
            if (!validatedContract.hasOwnProperty('name') || !validatedContract.name) {
                validatedContract.name = 'Contratto Senza Nome';
            }
            if (!validatedContract.hasOwnProperty('quantity') || typeof validatedContract.quantity !== 'number') {
                console.warn('⚠️ Contratto con quantity invalida:', contract);
                validatedContract.quantity = 0;
            }
            if (!validatedContract.hasOwnProperty('completed') || typeof validatedContract.completed !== 'number') {
                validatedContract.completed = 0;
            }
            if (!validatedContract.hasOwnProperty('deadline') || !validatedContract.deadline) {
                validatedContract.deadline = new Date().toISOString().split('T')[0];
            }
            if (!validatedContract.hasOwnProperty('priority')) {
                validatedContract.priority = 'normal';
            }
            if (!validatedContract.hasOwnProperty('status')) {
                validatedContract.status = 'active';
            }
            
            return validatedContract;
        }).filter(contract => contract.quantity > 0); // Rimuovi contratti con quantità zero
        
        console.log(`📋 Contratti validati: ${this.contracts.length}/${contracts.length}`);
    }

    /**
     * Pulisce tutti i contratti
     */
    clearContracts() {
        this.contracts = [];
    }

    /**
     * Valida i dati di un contratto
     */
    validateContractData(data) {
        if (!data.name || !data.quantity || !data.deadline) {
            return { valid: false, message: 'Compila tutti i campi obbligatori' };
        }

        if (data.quantity <= 0) {
            return { valid: false, message: 'La quantità deve essere maggiore di zero' };
        }

        if (data.completed < 0 || data.completed > data.quantity) {
            return { valid: false, message: 'Le copie prodotte non possono essere negative o superiori al totale' };
        }

        return { valid: true };
    }
}

export default ContractManager;
