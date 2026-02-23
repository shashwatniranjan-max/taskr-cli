<div align="center">

# ✨ Taskr CLI

### A beautiful, dual-mode command-line task manager

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CLI](https://img.shields.io/badge/CLI-Interactive%20%2B%20Command-blueviolet?style=for-the-badge&logo=windowsterminal&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-2563EB?style=for-the-badge)](#-license)

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%">
</div>

## 📸 Preview

```text
  ╔════════════════════════════════════╗
  ║         📋 YOUR TASKS             ║
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
  ║       📊 TASK STATISTICS          ║
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
- 💾 Local persistence in `tasks.json` (no database required)
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
task

# Run commands
task add "Build Taskr" -p high
task list
```

For local development without global install, use `node index.js ...`.

## 📖 Command Guide

| Command | Description |
|---------|-------------|
| `task` | Launch interactive menu mode |
| `task add "task" -p <level>` | Add a task with optional priority |
| `task list` | List all tasks |
| `task list -p high` | List only one priority |
| `task update <index>` | Toggle done/pending |
| `task edit <index> "new text"` | Edit a task title |
| `task delete <index>` | Delete one task |
| `task priority <index> <level>` | Change task priority |
| `task search <keyword>` | Search tasks by keyword |
| `task stats` | Show totals + progress bar |
| `task clear` | Remove completed tasks |
| `task remove-all` | Remove all tasks (double confirm) |

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

The test script runs an end-to-end CLI flow and restores your original `tasks.json` at the end.

## 📁 Project Structure

```text
taskr-cli/
├── index.js                     # Slim entry point
├── src/
│   ├── commands/                # One file per CLI command
│   │   ├── index.js             # Barrel — registers all commands
│   │   ├── add.js
│   │   ├── list.js
│   │   ├── delete.js
│   │   ├── update.js
│   │   ├── edit.js
│   │   ├── priority.js
│   │   ├── clear.js
│   │   ├── removeAll.js
│   │   ├── search.js
│   │   └── stats.js
│   ├── services/
│   │   └── taskService.js       # Read / write / sort tasks
│   ├── utils/
│   │   ├── theme.js             # Colors, gradients, priority config
│   │   └── display.js           # List, search-results, stats renderers
│   └── interactive/
│       └── menu.js              # Banner, quick-stats, interactive loop
├── test.js                      # End-to-end CLI tests
├── tasks.json                   # Local task storage (auto-generated)
├── package.json
└── README.md
```

## 💾 Data Format

Tasks are stored in `tasks.json`:

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
