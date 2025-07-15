# 🖨️ Printing Capacity Manager

Un'applicazione web per gestire contratti di stampa in un videogioco, sviluppata per ottimizzare la gestione della capacità di stampa e delle scadenze.

## 🎯 Funzionalità

### 📊 Gestione Contratti

- **Aggiunta contratti**: Nome, quantità, scadenza
- **Sistema di priorità**: Contratti ad alta/normale priorità
- **Completamento contratti**: Segna come completati prima della scadenza
- **Rimozione contratti**: Elimina contratti non più necessari

### 🧮 Analisi Intelligente

- **Calcolo fattibilità**: Determina se tutti i contratti sono completabili
- **Utilizzo capacità**: Mostra la percentuale di capacità utilizzata
- **Raccomandazioni**: Suggerimenti strategici personalizzati
- **Analisi priorità**: Valuta la completabilità dei contratti prioritari

### 💾 Gestione Dati

- **Salvataggio automatico**: I dati vengono salvati nel localStorage
- **Esportazione JSON**: Scarica backup dei tuoi dati
- **Importazione JSON**: Carica dati da file precedenti
- **Cancellazione sicura**: Rimuovi tutti i dati con conferma

## 🚀 Come Usare

### Avvio Rapido

1. **Avvia il server**:
   ```bash
   python3 server.py
   ```
2. **Apri il browser** su: `http://localhost:8000`
3. **Configura le impostazioni**:
   - Data di gioco (mese/anno)
   - Capacità di stampa massima
4. **Aggiungi contratti** e **visualizza l'analisi**

### Workflow Consigliato

1. 🔧 **Configura** le impostazioni base
2. ➕ **Aggiungi** i tuoi contratti
3. ⭐ **Assegna priorità** ai contratti più importanti
4. 📊 **Analizza** le raccomandazioni
5. ✅ **Completa** i contratti finiti
6. 💾 **Esporta** i dati come backup

## 🛠️ Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Icone**: Font Awesome
- **Font**: Inter (Google Fonts)
- **Salvataggio**: localStorage + JSON Export/Import
- **Server**: Python HTTP Server (per testing locale)

## 📋 Struttura del Progetto

```
Printing-capacity/
├── index.html          # Pagina principale
├── style.css           # Stili CSS
├── script.js           # Logica JavaScript
├── server.py           # Server HTTP locale
└── README.md           # Documentazione
```

## 🎨 Caratteristiche del Design

- **🎯 Design moderno**: Interfaccia pulita e intuitiva
- **📱 Responsive**: Funziona su desktop e mobile
- **🎭 Animazioni fluide**: Transizioni ed effetti hover
- **🌈 Sistema di colori**: Palette coerente e accessibile
- **💡 Feedback visivo**: Notifiche e indicatori di stato

## 🔧 Personalizzazione

### Modificare i colori

Modifica le variabili CSS in `style.css`:

```css
:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### Aggiungere nuove funzionalità

1. Modifica `script.js` per la logica
2. Aggiorna `index.html` per l'interfaccia
3. Aggiungi stili in `style.css`

## 🚀 Deployment

### Hosting Locale

```bash
python3 server.py
```

### Hosting Web

1. Carica `index.html`, `style.css`, `script.js` sul tuo server
2. Configura il server per servire file statici
3. Assicurati che il MIME type per `.json` sia configurato

## 🐛 Troubleshooting

### Problemi comuni:

- **Porta occupata**: Cambia la porta in `server.py`
- **Dati non salvati**: Controlla che localStorage sia abilitato
- **File JSON non importato**: Verifica che il file abbia la struttura corretta

### Struttura JSON valida:

```json
{
  "gameDate": "2025-07",
  "printCapacity": 1000,
  "contracts": [
    {
      "id": 1720094400000,
      "name": "Contratto Test",
      "quantity": 500,
      "deadline": "2025-12",
      "priority": "normal"
    }
  ]
}
```

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch per la tua feature
3. Commit delle modifiche
4. Push al branch
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.

## 🎮 Gaming Context

Questo tool è stato sviluppato specificamente per gestire contratti di stampa in videogiochi dove:

- Hai una capacità di stampa limitata per mese
- Devi accettare contratti con scadenze diverse
- Puoi scegliere se dividere la capacità o concentrarla su singoli contratti
- Hai bisogno di ottimizzare la gestione per massimizzare i profitti

---

**Buon gaming e buona gestione dei contratti!** 🎮🖨️
