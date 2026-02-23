#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const inquirer = require("inquirer");

const taskFilePath = path.join(__dirname, "tasks.json");

// Priority configuration with labels, colors, and icons
const PRIORITIES = {
    high: { label: "HIGH", color: chalk.hex('#fb7185'), icon: "▲" },
    medium: { label: "MED", color: chalk.hex('#c4b5fd'), icon: "◆" },
    low: { label: "LOW", color: chalk.hex('#67e8f9'), icon: "▽" }
};

// Unified purple theme colors
const PB = chalk.hex('#7c3aed');          // Primary border (violet)
const ACCENT_NUM = chalk.hex('#a78bfa');  // Number accent (light violet)
const STATUS_DONE = chalk.hex('#34d399'); // Completed (emerald)
const STATUS_PEND = chalk.hex('#fbbf24'); // Pending (amber)

const getTasks = () => {
    try {
        const data = fs.readFileSync(taskFilePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveTasks = (task) => {
    fs.writeFileSync(taskFilePath, JSON.stringify(task, null, 2));
}

// Sort tasks by priority (high > medium > low)
const sortByPriority = (tasks) => {
    const order = { high: 0, medium: 1, low: 2 };
    return [...tasks].sort((a, b) => order[a.priority || "medium"] - order[b.priority || "medium"]);
};

program
    .command("add <task>")
    .description("Add a new task")
    .option("-p, --priority <level>", "Set priority (high, medium, low)", "medium")
    .action((task, options) => {
        const priority = ["high", "medium", "low"].includes(options.priority)
            ? options.priority
            : "medium";
        const tasks = getTasks();
        tasks.push({ title: task, completed: false, id: Date.now(), priority });
        saveTasks(tasks);
        const p = PRIORITIES[priority];
        console.log(chalk.green(`✨ Added: "${task}" ${p.icon} ${p.color(p.label)}`));
        listTasks();
        process.exit(0);
    })

program
    .command("list")
    .description("list all the tasks")
    .option("-p, --priority <level>", "Filter by priority (high, medium, low)")
    .action((options) => {
        listTasks(options.priority);
        process.exit(0);
    })

program
    .command("delete <index>")
    .description("Delete a task at specific index")
    .action((index) => {
        const tasks = sortByPriority(getTasks());
        const taskIndex = parseInt(index, 10) - 1;
        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid number from the list."));
            process.exit(1);
        }
        const removedTask = tasks.splice(taskIndex, 1);
        saveTasks(tasks);
        console.log(chalk.yellow(`🗑️  Deleted: "${removedTask[0].title}"`));
        listTasks();
        process.exit(0);
    })

function listTasks(filterPriority = null) {
    let tasks = getTasks();

    // Add default priority for old tasks (backwards compatibility)
    tasks = tasks.map(t => ({ ...t, priority: t.priority || "medium" }));

    // Sort by priority (high first, then medium, then low)
    tasks = sortByPriority(tasks);

    // Filter by priority if specified
    if (filterPriority && ["high", "medium", "low"].includes(filterPriority)) {
        tasks = tasks.filter(t => t.priority === filterPriority);
    }

    if (tasks.length === 0) {
        console.log(chalk.dim("\n  📭 No tasks yet. Add one with: task add \"your task\""));
        return;
    }
    console.log(PB.bold("\n  ╔════════════════════════════════════╗"));
    console.log(PB.bold("  ║") + chalk.white.bold("         📋 YOUR TASKS             ") + PB.bold("║"));
    console.log(PB.bold("  ╠════════════════════════════════════╣"));
    tasks.forEach((task, index) => {
        const p = PRIORITIES[task.priority || "medium"];
        const status = task.completed
            ? STATUS_DONE.bold(" ✓ Done   ")
            : STATUS_PEND.bold(" ○ Pending");
        const title = task.completed
            ? chalk.dim.strikethrough(task.title)
            : chalk.white(task.title);
        const num = ACCENT_NUM(`  ${(index + 1).toString().padStart(2, ' ')}.`);
        console.log(`${num} ${p.color(p.icon)} ${title}`);
        console.log(`      ${status} ${chalk.dim('│')} ${p.color(p.label)}`);
    });
    console.log(PB.bold("  ╚════════════════════════════════════╝\n"));
}

program
    .command("update <index>")
    .description("update if task is completed or not")
    .action((index) => {
        const tasks = sortByPriority(getTasks());
        const taskIndex = parseInt(index, 10) - 1;
        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid task number."));
            return;
        }
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        const status = tasks[taskIndex].completed ? chalk.green("completed ✓") : chalk.yellow("pending");
        console.log(chalk.blue(`🔄 Marked "${tasks[taskIndex].title}" as ${status}`));
        listTasks();
        process.exit(0);
    })

program
    .command("edit <index> <newtask>")
    .description("Edit the specific task with given index")
    .action((index, newtask) => {
        const tasks = sortByPriority(getTasks());
        const taskIndex = parseInt(index, 10) - 1;
        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid task number."));
            return;
        }
        const oldTask = tasks[taskIndex].title;
        tasks[taskIndex].title = newtask;
        saveTasks(tasks);
        console.log(chalk.blue(`✏️  Updated: "${chalk.dim(oldTask)}" → "${chalk.white(newtask)}"`));
        listTasks();
        process.exit(0);
    })

program
    .command("priority <index> <level>")
    .description("Change priority of a task (high, medium, low)")
    .action((index, level) => {
        const tasks = sortByPriority(getTasks());
        const taskIndex = parseInt(index, 10) - 1;
        if (isNaN(taskIndex) || taskIndex < 0 || taskIndex >= tasks.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid task number."));
            process.exit(1);
        }
        if (!["high", "medium", "low"].includes(level)) {
            console.error(chalk.red("❌ Invalid priority! Use: high, medium, or low"));
            process.exit(1);
        }
        const oldPriority = tasks[taskIndex].priority || "medium";
        tasks[taskIndex].priority = level;
        saveTasks(tasks);
        const p = PRIORITIES[level];
        console.log(chalk.blue(`🏷️  Changed "${tasks[taskIndex].title}" from ${oldPriority} → ${p.icon} ${p.color(level)}`));
        listTasks();
        process.exit(0);
    })

program
    .command("clear")
    .description("deletes all the completed tasks")
    .action(() => {
        const tasks = getTasks();
        const completedCount = tasks.filter(t => t.completed).length;
        const newTasks = tasks.filter((task) => !task.completed);
        saveTasks(newTasks);
        console.log(chalk.yellow(`🧹 Cleared ${completedCount} completed task(s)`));
        listTasks();
        process.exit(0);
    })

program
    .command("remove-all")
    .description("Delete ALL tasks (requires confirmation)")
    .action(async () => {
        const tasks = getTasks();
        if (tasks.length === 0) {
            console.log(chalk.dim('\n  📭 No tasks to remove.'));
            process.exit(0);
        }
        console.log(chalk.red.bold(`\n  ⚠️  WARNING: This will permanently delete ALL ${tasks.length} task(s)!`));
        const { confirm } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: chalk.red(`Are you sure you want to delete all ${tasks.length} task(s)?`),
            default: false
        }]);
        if (!confirm) { console.log(chalk.dim('  Cancelled.')); process.exit(0); }
        const { typed } = await inquirer.prompt([{
            type: 'input',
            name: 'typed',
            message: chalk.red.bold('Type "DELETE ALL" to confirm:'),
        }]);
        if (typed.trim() === 'DELETE ALL') {
            saveTasks([]);
            console.log(chalk.red(`\n  💀 All ${tasks.length} task(s) have been permanently deleted.`));
        } else {
            console.log(chalk.dim('  Confirmation failed. No tasks were deleted.'));
        }
        process.exit(0);
    })

program
    .command("search <keyword>")
    .description("Find tasks containing specific text")
    .action((keyword) => {
        const tasks = sortByPriority(getTasks());
        const searchedTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(keyword.toLowerCase())
        );

        if (searchedTasks.length === 0) {
            console.log(chalk.yellow(`\n  🔍 No tasks found matching "${keyword}"\n`));
            process.exit(0);
        }

        console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
        console.log(PB.bold(`  ║`) + chalk.white.bold(`   🔍 Results for "${keyword}"`.padEnd(35)) + PB.bold(`║`));
        console.log(PB.bold(`  ╠════════════════════════════════════╣`));
        searchedTasks.forEach((task, index) => {
            const p = PRIORITIES[task.priority || "medium"];
            const status = task.completed
                ? STATUS_DONE.bold(" ✓ Done   ")
                : STATUS_PEND.bold(" ○ Pending");
            const title = task.completed
                ? chalk.dim.strikethrough(task.title)
                : chalk.white(task.title);
            const num = ACCENT_NUM(`  ${(index + 1).toString().padStart(2, ' ')}.`);
            console.log(`${num} ${p.color(p.icon)} ${title}`);
            console.log(`      ${status} ${chalk.dim('│')} ${p.color(p.label)}`);
        });
        console.log(PB.bold(`  ╚════════════════════════════════════╝\n`));
        process.exit(0);
    })

program
    .command("stats")
    .description("Show total, completed, pending counts")
    .action(() => {
        const tasks = getTasks();
        const completed = tasks.filter(t => t.completed).length;
        const pending = tasks.length - completed;
        const progress = tasks.length === 0 ? 0 : ((completed / tasks.length) * 100).toFixed(1);

        // Priority counts
        const highCount = tasks.filter(t => t.priority === "high").length;
        const mediumCount = tasks.filter(t => (t.priority || "medium") === "medium").length;
        const lowCount = tasks.filter(t => t.priority === "low").length;

        // Progress bar
        const barLength = 20;
        const filledLength = Math.round((progress / 100) * barLength);
        const bar = chalk.hex('#8b5cf6')('█'.repeat(filledLength)) + chalk.hex('#3b0764')('░'.repeat(barLength - filledLength));

        console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
        console.log(PB.bold(`  ║`) + chalk.white.bold(`       📊 TASK STATISTICS          `) + PB.bold(`║`));
        console.log(PB.bold(`  ╠════════════════════════════════════╣`));
        console.log(PB.bold(`  ║`) + `  📝 Total:     ${chalk.white.bold(tasks.length.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ║`) + `  ✅ Completed: ${STATUS_DONE.bold(completed.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ║`) + `  ⏳ Pending:   ${STATUS_PEND.bold(pending.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ╠════════════════════════════════════╣`));
        console.log(PB.bold(`  ║`) + `  ▲ High:       ${PRIORITIES.high.color.bold(highCount.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ║`) + `  ◆ Medium:     ${PRIORITIES.medium.color.bold(mediumCount.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ║`) + `  ▽ Low:        ${PRIORITIES.low.color.bold(lowCount.toString().padStart(3))}               ` + PB.bold(`║`));
        console.log(PB.bold(`  ╠════════════════════════════════════╣`));
        console.log(PB.bold(`  ║`) + `  ${bar} ${progress}%  ` + PB.bold(`║`));
        console.log(PB.bold(`  ╚════════════════════════════════════╝\n`));
        process.exit(0);
    })




// ═══════════════════════════════════════════════════════════
//  INTERACTIVE MENU MODE (when no command is provided)
// ═══════════════════════════════════════════════════════════

const TASKR_GRADIENT = gradient(['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']);
const ACCENT_GRADIENT = gradient(['#06b6d4', '#3b82f6', '#6366f1']);

function showBanner() {
    console.clear();
    const banner = figlet.textSync('TASKR', {
        font: 'ANSI Shadow',
        horizontalLayout: 'fitted'
    });
    console.log('');
    console.log(TASKR_GRADIENT(banner));
    console.log(ACCENT_GRADIENT('  ─────────────────────────────────────────────────────────'));
    console.log(chalk.dim('  ⚡ A powerful command-line task manager') + chalk.dim('         v1.0.0'));
    console.log(ACCENT_GRADIENT('  ─────────────────────────────────────────────────────────'));
    console.log('');
}

function showQuickStats() {
    const tasks = getTasks();
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const pending = total - done;
    const high = tasks.filter(t => t.priority === 'high' && !t.completed).length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);

    const barLen = 25;
    const filled = Math.round((progress / 100) * barLen);
    const bar = chalk.hex('#8b5cf6')('━'.repeat(filled)) + chalk.gray('━'.repeat(barLen - filled));

    console.log(chalk.dim('  ┌─────────────────────────────────────────────┐'));
    console.log(chalk.dim('  │') + `  📊 ${chalk.white.bold(total)} tasks  ${STATUS_DONE('✓' + done)}  ${STATUS_PEND('○' + pending)}  ${high > 0 ? PRIORITIES.high.color('▲ ' + high + ' urgent') : ''}`.padEnd(55) + chalk.dim('│'));
    console.log(chalk.dim('  │') + `  ${bar} ${chalk.white.bold(progress + '%')}`.padEnd(55) + chalk.dim('│'));
    console.log(chalk.dim('  └─────────────────────────────────────────────┘'));
    console.log('');
}

async function interactiveMenu() {
    showBanner();
    showQuickStats();

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: chalk.hex('#8b5cf6').bold('What would you like to do?'),
                choices: [
                    new inquirer.Separator(chalk.dim(' ─── Actions ───────────────')),
                    { name: '  📋  View All Tasks', value: 'list' },
                    { name: '  ➕  Add New Task', value: 'add' },
                    { name: '  ✅  Toggle Complete/Pending', value: 'update' },
                    { name: '  ✏️   Edit Task', value: 'edit' },
                    { name: '  🏷️   Change Priority', value: 'priority' },
                    new inquirer.Separator(chalk.dim(' ─── Manage ────────────────')),
                    { name: '  🗑️   Delete Task', value: 'delete' },
                    { name: '  🧹  Clear Completed', value: 'clear' },
                    { name: chalk.red('  💀  Remove ALL Tasks'), value: 'remove-all' },
                    new inquirer.Separator(chalk.dim(' ─── Info ──────────────────')),
                    { name: '  🔍  Search Tasks', value: 'search' },
                    { name: '  📊  View Statistics', value: 'stats' },
                    new inquirer.Separator(chalk.dim(' ───────────────────────────')),
                    { name: chalk.dim('  🚪  Exit'), value: 'exit' },
                ],
                pageSize: 15,
                loop: false
            }
        ]);

        if (action === 'exit') {
            console.log(TASKR_GRADIENT('\n  ✨ Stay productive! Goodbye.\n'));
            process.exit(0);
        }

        await handleAction(action);
    }
}

async function handleAction(action) {
    console.log('');

    switch (action) {
        case 'list': {
            const { filterChoice } = await inquirer.prompt([{
                type: 'list',
                name: 'filterChoice',
                message: 'Filter by priority?',
                choices: [
                    { name: '  All Tasks', value: null },
                    { name: '  🔴 High Only', value: 'high' },
                    { name: '  🟡 Medium Only', value: 'medium' },
                    { name: '  🟢 Low Only', value: 'low' },
                ]
            }]);
            listTasks(filterChoice);
            break;
        }

        case 'add': {
            const { task } = await inquirer.prompt([{
                type: 'input',
                name: 'task',
                message: 'Enter your task:',
                validate: input => input.trim() ? true : 'Task cannot be empty!'
            }]);
            const { priority } = await inquirer.prompt([{
                type: 'list',
                name: 'priority',
                message: 'Set priority:',
                choices: [
                    { name: '🔴 High', value: 'high' },
                    { name: '🟡 Medium', value: 'medium' },
                    { name: '🟢 Low', value: 'low' },
                ],
                default: 'medium'
            }]);
            const tasks = getTasks();
            tasks.push({ title: task.trim(), completed: false, id: Date.now(), priority });
            saveTasks(tasks);
            const p = PRIORITIES[priority];
            console.log(chalk.green(`\n  ✨ Added: "${task.trim()}" ${p.icon} ${p.color(p.label)}`));
            listTasks();
            break;
        }

        case 'update': {
            const tasks = sortByPriority(getTasks());
            if (tasks.length === 0) { console.log(chalk.dim('  📭 No tasks to update.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which task to toggle?',
                choices: tasks.map((t, i) => ({
                    name: `  ${(i + 1).toString().padStart(2)}. ${PRIORITIES[t.priority || 'medium'].icon} ${t.completed ? chalk.dim.strikethrough(t.title) : t.title} ${t.completed ? chalk.green('✓') : chalk.red('○')}`,
                    value: i
                })),
                pageSize: 15
            }]);
            tasks[selected].completed = !tasks[selected].completed;
            saveTasks(tasks);
            const status = tasks[selected].completed ? chalk.green('completed ✓') : chalk.yellow('pending');
            console.log(chalk.blue(`\n  🔄 Marked "${tasks[selected].title}" as ${status}`));
            listTasks();
            break;
        }

        case 'edit': {
            const tasks = sortByPriority(getTasks());
            if (tasks.length === 0) { console.log(chalk.dim('  📭 No tasks to edit.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which task to edit?',
                choices: tasks.map((t, i) => ({
                    name: `  ${(i + 1).toString().padStart(2)}. ${PRIORITIES[t.priority || 'medium'].icon} ${t.title}`,
                    value: i
                })),
                pageSize: 15
            }]);
            const { newtask } = await inquirer.prompt([{
                type: 'input',
                name: 'newtask',
                message: `New text (current: "${tasks[selected].title}"):`,
                default: tasks[selected].title,
                validate: input => input.trim() ? true : 'Task cannot be empty!'
            }]);
            const oldTask = tasks[selected].title;
            tasks[selected].title = newtask.trim();
            saveTasks(tasks);
            console.log(chalk.blue(`\n  ✏️  Updated: "${chalk.dim(oldTask)}" → "${chalk.white(newtask.trim())}"`));
            listTasks();
            break;
        }

        case 'priority': {
            const tasks = sortByPriority(getTasks());
            if (tasks.length === 0) { console.log(chalk.dim('  📭 No tasks.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Change priority for which task?',
                choices: tasks.map((t, i) => ({
                    name: `  ${(i + 1).toString().padStart(2)}. ${PRIORITIES[t.priority || 'medium'].icon} ${t.title} [${(t.priority || 'medium').toUpperCase()}]`,
                    value: i
                })),
                pageSize: 15
            }]);
            const { level } = await inquirer.prompt([{
                type: 'list',
                name: 'level',
                message: 'New priority:',
                choices: [
                    { name: '🔴 High', value: 'high' },
                    { name: '🟡 Medium', value: 'medium' },
                    { name: '🟢 Low', value: 'low' },
                ],
                default: tasks[selected].priority || 'medium'
            }]);
            tasks[selected].priority = level;
            saveTasks(tasks);
            const p = PRIORITIES[level];
            console.log(chalk.blue(`\n  🏷️  Changed "${tasks[selected].title}" → ${p.icon} ${p.color(level)}`));
            listTasks();
            break;
        }

        case 'delete': {
            const tasks = sortByPriority(getTasks());
            if (tasks.length === 0) { console.log(chalk.dim('  📭 No tasks to delete.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which task to delete?',
                choices: tasks.map((t, i) => ({
                    name: `  ${(i + 1).toString().padStart(2)}. ${PRIORITIES[t.priority || 'medium'].icon} ${t.title}`,
                    value: i
                })),
                pageSize: 15
            }]);
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `Delete "${tasks[selected].title}"?`,
                default: false
            }]);
            if (confirm) {
                const removed = tasks.splice(selected, 1);
                saveTasks(tasks);
                console.log(chalk.yellow(`\n  🗑️  Deleted: "${removed[0].title}"`));
            } else {
                console.log(chalk.dim('  Cancelled.'));
            }
            listTasks();
            break;
        }

        case 'clear': {
            const tasks = getTasks();
            const completedCount = tasks.filter(t => t.completed).length;
            if (completedCount === 0) {
                console.log(chalk.dim('  No completed tasks to clear.'));
                break;
            }
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `Clear ${completedCount} completed task(s)?`,
                default: true
            }]);
            if (confirm) {
                const newTasks = tasks.filter(t => !t.completed);
                saveTasks(newTasks);
                console.log(chalk.yellow(`\n  🧹 Cleared ${completedCount} completed task(s)`));
            }
            listTasks();
            break;
        }

        case 'remove-all': {
            const tasks = getTasks();
            if (tasks.length === 0) { console.log(chalk.dim('  📭 No tasks to remove.')); break; }
            console.log(chalk.red.bold(`\n  ⚠️  WARNING: This will permanently delete ALL ${tasks.length} task(s)!`));
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: chalk.red(`Are you sure you want to delete all ${tasks.length} task(s)?`),
                default: false
            }]);
            if (!confirm) { console.log(chalk.dim('  Cancelled.')); break; }
            const { typed } = await inquirer.prompt([{
                type: 'input',
                name: 'typed',
                message: chalk.red.bold('Type "DELETE ALL" to confirm:'),
            }]);
            if (typed.trim() === 'DELETE ALL') {
                saveTasks([]);
                console.log(chalk.red(`\n  💀 All ${tasks.length} task(s) have been permanently deleted.`));
            } else {
                console.log(chalk.dim('  Confirmation failed. No tasks were deleted.'));
            }
            break;
        }

        case 'search': {
            const { keyword } = await inquirer.prompt([{
                type: 'input',
                name: 'keyword',
                message: 'Search for:',
                validate: input => input.trim() ? true : 'Enter a keyword!'
            }]);
            const tasks = sortByPriority(getTasks());
            const results = tasks.filter(t => t.title.toLowerCase().includes(keyword.toLowerCase().trim()));
            if (results.length === 0) {
                console.log(chalk.yellow(`\n  🔍 No tasks found matching "${keyword.trim()}"`));
            } else {
                console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
                console.log(PB.bold(`  ║`) + chalk.white.bold(`   🔍 Results for "${keyword.trim()}"`.padEnd(35)) + PB.bold(`║`));
                console.log(PB.bold(`  ╠════════════════════════════════════╣`));
                results.forEach((task, index) => {
                    const p = PRIORITIES[task.priority || 'medium'];
                    const status = task.completed ? STATUS_DONE.bold(' ✓ Done   ') : STATUS_PEND.bold(' ○ Pending');
                    const title = task.completed ? chalk.dim.strikethrough(task.title) : chalk.white(task.title);
                    console.log(`  ${ACCENT_NUM((index + 1).toString().padStart(2) + '.')} ${p.color(p.icon)} ${title}`);
                    console.log(`      ${status} ${chalk.dim('│')} ${p.color(p.label)}`);
                });
                console.log(PB.bold(`  ╚════════════════════════════════════╝`));
            }
            console.log('');
            break;
        }

        case 'stats': {
            const tasks = getTasks();
            const completed = tasks.filter(t => t.completed).length;
            const pending = tasks.length - completed;
            const progress = tasks.length === 0 ? 0 : ((completed / tasks.length) * 100).toFixed(1);
            const highCount = tasks.filter(t => t.priority === 'high').length;
            const mediumCount = tasks.filter(t => (t.priority || 'medium') === 'medium').length;
            const lowCount = tasks.filter(t => t.priority === 'low').length;
            const barLength = 20;
            const filledLength = Math.round((progress / 100) * barLength);
            const bar = chalk.hex('#8b5cf6')('█'.repeat(filledLength)) + chalk.hex('#3b0764')('░'.repeat(barLength - filledLength));

            console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
            console.log(PB.bold(`  ║`) + chalk.white.bold(`       📊 TASK STATISTICS          `) + PB.bold(`║`));
            console.log(PB.bold(`  ╠════════════════════════════════════╣`));
            console.log(PB.bold(`  ║`) + `  📝 Total:     ${chalk.white.bold(tasks.length.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ║`) + `  ✅ Completed: ${STATUS_DONE.bold(completed.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ║`) + `  ⏳ Pending:   ${STATUS_PEND.bold(pending.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ╠════════════════════════════════════╣`));
            console.log(PB.bold(`  ║`) + `  ▲ High:       ${PRIORITIES.high.color.bold(highCount.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ║`) + `  ◆ Medium:     ${PRIORITIES.medium.color.bold(mediumCount.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ║`) + `  ▽ Low:        ${PRIORITIES.low.color.bold(lowCount.toString().padStart(3))}               ` + PB.bold(`║`));
            console.log(PB.bold(`  ╠════════════════════════════════════╣`));
            console.log(PB.bold(`  ║`) + `  ${bar} ${progress}%  ` + PB.bold(`║`));
            console.log(PB.bold(`  ╚════════════════════════════════════╝\n`));
            break;
        }
    }

    // Pause before going back to menu
    await inquirer.prompt([{
        type: 'input',
        name: 'continue',
        message: chalk.dim('Press ENTER to continue...'),
    }]);
    showBanner();
    showQuickStats();
}

// Route: interactive mode if no command given, otherwise commander handles it
if (process.argv.length <= 2) {
    interactiveMenu().catch(err => {
        if (err.isTtyError) {
            console.error(chalk.red('Interactive mode requires a TTY terminal.'));
        } else {
            console.error(chalk.red('Error:'), err.message);
        }
        process.exit(1);
    });
} else {
    program.parse();
}
