const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");
const { PRIORITIES, PB, ACCENT_NUM, STATUS_DONE, STATUS_PEND, TASKR_GRADIENT, ACCENT_GRADIENT } = require("../utils/theme");
const { getTasks, saveTasks, sortByPriority } = require("../services/taskService");
const { listTasks, renderSearchResults, renderStats } = require("../utils/display");

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
            renderSearchResults(keyword.trim(), results);
            break;
        }

        case 'stats': {
            const tasks = getTasks();
            renderStats(tasks);
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

module.exports = interactiveMenu;
