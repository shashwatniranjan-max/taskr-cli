# 📝 Taskr CLI

A powerful and intuitive command-line todo application built with Node.js and Commander.js.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CLI](https://img.shields.io/badge/CLI-Tool-blue?style=for-the-badge)

## ✨ Features

| Command | Description |
|---------|-------------|
| ➕ `add` | Add new tasks quickly |
| 📋 `list` | View all todos with status indicators |
| ✏️ `edit` | Modify existing tasks |
| ✅ `update` | Toggle completion status |
| 🗑️ `delete` | Remove tasks by index |
| 🧹 `clear` | Remove all completed tasks |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/shashwatniranjan-max/taskr-cli.git
cd taskr-cli

# Install dependencies
npm install

# Add your first todo
node todoCommander.js add "Learn Node.js"

# View all todos
node todoCommander.js list
```

## 📖 Commands

### ➕ Add a new todo
```bash
node todoCommander.js add "Buy groceries"
# Output: Added the todo: Buy groceries
```

### 📋 List all todos
```bash
node todoCommander.js list
```
```
------Todo list------
1. Buy groceries ..❌Pending
2. Finish homework ..✅Done
3. Call mom ..❌Pending
----------------------
```

### ✅ Toggle todo status
```bash
node todoCommander.js update 1
# Toggles between ✅Done and ❌Pending
```

### ✏️ Edit a todo
```bash
node todoCommander.js edit 1 "Buy organic groceries"
# Output: updated the todo on number 1. with: Buy organic groceries
```

### 🗑️ Delete a todo
```bash
node todoCommander.js delete 2
# Output: Deleted todo: Finish homework
```

### 🧹 Clear completed todos
```bash
node todoCommander.js clear
# Output: completed todos are cleared
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Commander.js** - CLI framework for parsing arguments
- **File System (fs)** - JSON-based data persistence

## 📁 Project Structure

```
todo-commander-cli/
├── todoCommander.js    # Main CLI application
├── todos.json          # Data storage (auto-generated)
├── package.json        # Project dependencies
└── README.md           # Documentation
```

## 💾 Data Format

Todos are stored in `todos.json`:
```json
[
  {
    "title": "Learn Node.js",
    "completed": false,
    "id": 1706198400000
  }
]
```

## 🚀 Roadmap

- [ ] 🔍 Search todos by keyword
- [ ] 📊 Stats command (total/done/pending)
- [ ] 🎨 Colored output with chalk
- [ ] ⚡ Priority levels (high/medium/low)
- [ ] 📅 Due dates

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📜 License

MIT License - feel free to use this project for learning!

---

⭐ **Star this repo if you find it helpful!**
