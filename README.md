# 🖨️ Printing Capacity Manager for Software Inc.

A web support tool for managing print contracts in the game **Software Inc.**
Designed to optimize print capacity management and contract deadlines within the gameplay.

## 🎯 Features

### 📊 Contract Management

- **Add contracts**: Name, quantity, deadline
- **Priority system**: High/normal priority contracts
- **Complete contracts**: Mark as completed before the deadline
- **Remove contracts**: Delete contracts no longer needed

### 🧮 Smart Analysis

- **Feasibility calculation**: Determines if all contracts can be completed
- **Capacity usage**: Shows the percentage of used print capacity
- **Recommendations**: Personalized strategic suggestions
- **Priority analysis**: Evaluates the feasibility of high-priority contracts

### 💾 Data Management

- **Auto-save**: Data is saved in localStorage
- **JSON export**: Download a backup of your data
- **JSON import**: Load data from previous files
- **Safe deletion**: Remove all data with confirmation

## 🚀 How to Use

### Quick Start

1. **Start the server**:
   ```bash
   python3 server.py
   ```
2. **Open your browser** at: `http://localhost:8000`
3. **Configure settings**:
   - Game date (month/year)
   - Maximum print capacity
4. **Add contracts** and **view the analysis**

### Recommended Workflow

1. 🔧 **Configure** the basic settings
2. ➕ **Add** your contracts
3. ⭐ **Assign priority** to the most important contracts
4. 📊 **Analyze** the recommendations
5. ✅ **Complete** finished contracts
6. 💾 **Export** your data as a backup

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, Custom Properties
- **Icons**: Font Awesome
- **Font**: Inter (Google Fonts)
- **Storage**: localStorage + JSON Export/Import
- **Server**: Python HTTP Server (for local testing)

## 📋 Project Structure

```
Printing-capacity/
├── index.html          # Main page
├── style.css           # CSS styles
├── script.js           # JavaScript logic
├── server.py           # Local HTTP server
└── README.md           # Documentation
```

## 🎨 Design Features

- **🎯 Modern design**: Clean and intuitive interface
- **📱 Responsive**: Works on desktop and mobile
- **🎭 Smooth animations**: Transitions and hover effects
- **🌈 Color system**: Consistent and accessible palette
- **💡 Visual feedback**: Notifications and status indicators

## 🔧 Customization

### Change colors

Edit the CSS variables in `style.css`:

```css
:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
}
```

### Add new features

1. Edit `script.js` for logic
2. Update `index.html` for the interface
3. Add styles in `style.css`

## 🚀 Deployment

### Local Hosting

```bash
python3 server.py
```

### Web Hosting

1. Upload `index.html`, `style.css`, `script.js` to your server
2. Configure the server to serve static files
3. Make sure the MIME type for `.json` is set

## 🐛 Troubleshooting

### Common issues:

- **Port in use**: Change the port in `server.py`
- **Data not saved**: Check that localStorage is enabled
- **JSON file not imported**: Make sure the file has the correct structure

### Valid JSON structure:

```json
{
  "gameDate": "2025-07",
  "printCapacity": 1000,
  "contracts": [
    {
      "id": 1720094400000,
      "name": "Test Contract",
      "quantity": 500,
      "deadline": "2025-12",
      "priority": "normal"
    }
  ]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a branch for your feature
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is released under the MIT license.

## 🎮 Gaming Context

This tool was developed specifically to manage print contracts in games like Software Inc. where:

- You have a limited print capacity per month
- You must accept contracts with different deadlines
- You can choose whether to split capacity or focus on single contracts
- You need to optimize management to maximize profits

---

**Happy gaming and contract management!** 🎮🖨️
