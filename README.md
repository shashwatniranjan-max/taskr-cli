<div align="center">

# ✨ Todo CLI

### A beautiful, feature-rich command-line todo manager

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![CLI](https://img.shields.io/badge/CLI-Tool-purple?style=for-the-badge&logo=windowsterminal&logoColor=white)](https://www.npmjs.com/)

<br/>

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">

</div>

## 📸 Preview

```
  ╔════════════════════════════════════╗
  ║         📋 YOUR TODOS             ║
  ╠════════════════════════════════════╣
   1. Learn Node.js
       ✓ Done   
   2. Build a CLI app
       ✓ Done   
   3. Add colorful output
       ○ Pending
  ╚════════════════════════════════════╝
```

```
  ╔════════════════════════════════════╗
  ║       📊 TODO STATISTICS          ║
  ╠════════════════════════════════════╣
  ║  📝 Total:       3               ║
  ║  ✅ Completed:   2               ║
  ║  ⏳ Pending:     1               ║
  ╠════════════════════════════════════╣
  ║  █████████████░░░░░░░ 66.7%  ║
  ╚════════════════════════════════════╝
```

---

## ⚡ Features

<table>
<tr>
<td>

### 📋 Core Commands
| Command | Description |
|---------|-------------|
| `todo add <task>` | Add a new task |
| `todo list` | View all todos |
| `todo update <id>` | Toggle completion |
| `todo edit <id> <text>` | Edit a task |
| `todo delete <id>` | Remove a task |
| `todo clear` | Clear completed |

</td>
<td>

### 🔥 Power Features
| Command | Description |
|---------|-------------|
| `todo search <keyword>` | Find todos |
| `todo stats` | View statistics |
| `todo --help` | Show all commands |

### ✨ Highlights
- 🎨 Beautiful colored output
- 📊 Visual progress bar
- 🔍 Smart search
- 💾 Persistent storage

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/todo-commander-cli.git
cd todo-commander-cli

# Install dependencies
npm install

# Install globally (use from anywhere!)
npm install -g .
```

### Usage

```bash
# Now use 'todo' from anywhere!
todo add "Build something awesome"
todo list
todo stats
```

---

## 📖 Command Guide

### ➕ Add a Task
```bash
todo add "Buy groceries"
```
```
✨ Added: "Buy groceries"
```

### 📋 List All Tasks
```bash
todo list
```

### ✅ Mark Complete/Incomplete
```bash
todo update 1
```
```
🔄 Marked "Buy groceries" as completed ✓
```

### ✏️ Edit a Task
```bash
todo edit 1 "Buy organic groceries"
```
```
✏️  Updated: "Buy groceries" → "Buy organic groceries"
```

### 🗑️ Delete a Task
```bash
todo delete 1
```
```
🗑️  Deleted: "Buy organic groceries"
```

### 🔍 Search Tasks
```bash
todo search "buy"
```

### 📊 View Statistics
```bash
todo stats
```

### 🧹 Clear Completed
```bash
todo clear
```
```
🧹 Cleared 3 completed todo(s)
```

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Runtime Environment |
| ![Commander.js](https://img.shields.io/badge/Commander.js-red?style=flat-square) | CLI Framework |
| ![Chalk](https://img.shields.io/badge/Chalk-orange?style=flat-square) | Terminal Styling |
| ![JSON](https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white) | Data Storage |

</div>

---

## 📁 Project Structure

```
todo-commander-cli/
├── 📄 todo.js          # Main CLI application
├── 📄 todos.json       # Data storage (auto-generated)
├── 📄 package.json     # Dependencies & scripts
└── 📄 README.md        # You are here!
```

---

## 💾 Data Format

Todos are stored locally in `todos.json`:

```json
[
  {
    "title": "Learn Node.js",
    "completed": true,
    "id": 1706198400000
  }
]
```

---

## 🗺️ Roadmap

- [x] ➕ Add, edit, delete tasks
- [x] ✅ Toggle completion status
- [x] 🔍 Search functionality
- [x] 📊 Statistics with progress bar
- [x] 🎨 Colorful terminal output
- [x] 🌍 Global CLI installation
- [ ] ⚡ Priority levels (high/medium/low)
- [ ] 📅 Due dates & reminders
- [ ] 📂 Multiple lists support
- [ ] ☁️ Cloud sync

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. 🍴 Fork the repository
2. 🌿 Create your branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit changes: `git commit -m 'Add amazing feature'`
4. 📤 Push to branch: `git push origin feature/amazing-feature`
5. 🔃 Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### Made with ❤️ by Shashwat

⭐ **Star this repo if you find it helpful!** ⭐

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=social&logo=github)](https://github.com/yourusername)

</div>
