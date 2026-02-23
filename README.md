<div align="center">

# ✨ Taskr CLI

### A beautiful, dual-mode command-line todo manager

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CLI](https://img.shields.io/badge/CLI-Interactive%20%2B%20Command-blueviolet?style=for-the-badge&logo=windowsterminal&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-2563EB?style=for-the-badge)](#-license)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">
</div>

## 📸 Preview

```text
  ╔════════════════════════════════════╗
  ║         📋 YOUR TODOS             ║
  ╠════════════════════════════════════╣
   1. ▲ Fix critical bug
      ✓ Done    │ HIGH
   2. ◆ Build a CLI app
      ○ Pending │ MED
   3. ▽ Read documentation
      ○ Pending │ LOW
  ╚════════════════════════════════════╝
```

```text
  ╔════════════════════════════════════╗
  ║       📊 TODO STATISTICS          ║
  ╠════════════════════════════════════╣
  ║  📝 Total:       3                ║
  ║  ✅ Completed:   1                ║
  ║  ⏳ Pending:     2                ║
  ╠════════════════════════════════════╣
  ║  ▲ High:        1                ║
  ║  ◆ Medium:      1                ║
  ║  ▽ Low:         1                ║
  ╠════════════════════════════════════╣
  ║  ███████░░░░░░░░░░░░░ 33.3%      ║
  ╚════════════════════════════════════╝
```

## ⚡ Features

- ✅ Two usage modes: argument-based CLI + interactive menu mode
- 🏷️ Priority system (`high`, `medium`, `low`) with sorted output
- 🔍 Search command and 📊 statistics dashboard with progress bar
- 💾 Local persistence in `todos.json` (no database required)
- 🎨 Colorful terminal UI using `chalk`, `figlet`, and `gradient-string`
- 🛡️ Safe destructive flow for `remove-all` with double confirmation

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/shashwatniranjan-max/taskr-cli.git
cd taskr-cli

# Install dependencies
npm install

# Install globally (recommended)
npm install -g .

# Run interactive mode (no args)
todo

# Run commands
todo add "Build Taskr" -p high
todo list
```

For local development without global install, use `node todo.js ...`.

## 📖 Command Guide

| Command | Description |
|---------|-------------|
| `todo` | Launch interactive menu mode |
| `todo add "task" -p <level>` | Add a task with optional priority |
| `todo list` | List all todos |
| `todo list -p high` | List only one priority |
| `todo update <index>` | Toggle done/pending |
| `todo edit <index> "new text"` | Edit a task title |
| `todo delete <index>` | Delete one task |
| `todo priority <index> <level>` | Change task priority |
| `todo search <keyword>` | Search todos by keyword |
| `todo stats` | Show totals + progress bar |
| `todo clear` | Remove completed todos |
| `todo remove-all` | Remove all todos (double confirm) |

### Priority Levels

| Level | Icon | Label |
|-------|------|-------|
| `high` | ▲ | HIGH |
| `medium` | ◆ | MED |
| `low` | ▽ | LOW |

## 🧪 Run Tests

```bash
node test.js
```

The test script runs an end-to-end CLI flow and restores your original `todos.json` at the end.

## 📁 Project Structure

```text
todo-commander-cli/
├── todo.js                  # Main CLI + interactive app
├── test.js                  # Comprehensive command flow test
├── todos.json               # Local todo storage
├── package.json             # Project metadata and dependencies
├── package-lock.json
├── README.md
└── walkthrough.md.resolved
```

## 💾 Data Format

Todos are stored in `todos.json`:

```json
[
  {
    "title": "Build Taskr",
    "completed": false,
    "id": 1771791333442,
    "priority": "high"
  }
]
```

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push branch: `git push origin feature/your-feature`
5. Open a pull request

## 📜 License

MIT

---

<div align="center">

Made with ❤️ by Shashwat

⭐ Star the repo if it helped you stay productive.

</div>
