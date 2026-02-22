#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {program} = require("commander");
const chalk = require("chalk");
const figlet = require("figlet");
const gradient = require("gradient-string");
const inquirer = require("inquirer");

const todoFilePath = path.join(__dirname, "todos.json");

// Priority configuration with labels, colors, and icons
const PRIORITIES = {
    high: { label: "HIGH", color: chalk.red, icon: "🔴" },
    medium: { label: "MEDIUM", color: chalk.yellow, icon: "🟡" },
    low: { label: "LOW", color: chalk.green, icon: "🟢" }
};

const getTodos = () => {
    try {
        const data = fs.readFileSync(todoFilePath, "utf-8");
        return JSON.parse(data);
    }catch(err) {
        return [];
    }
};

const saveTodos = (todo) => {
    fs.writeFileSync(todoFilePath, JSON.stringify(todo, null, 2));
}

// Sort todos by priority (high > medium > low)
const sortByPriority = (todos) => {
    const order = { high: 0, medium: 1, low: 2 };
    return [...todos].sort((a, b) => order[a.priority || "medium"] - order[b.priority || "medium"]);
};

program
    .command("add <task>")
    .description("Add a new todo task")
    .option("-p, --priority <level>", "Set priority (high, medium, low)", "medium")
    .action((task, options) => {
        const priority = ["high", "medium", "low"].includes(options.priority) 
            ? options.priority 
            : "medium";
        const todos = getTodos();
        todos.push({title: task, completed: false, id: Date.now(), priority});
        saveTodos(todos);
        const p = PRIORITIES[priority];
        console.log(chalk.green(`✨ Added: "${task}" ${p.icon} ${p.color(p.label)}`));
        listTodos();
    })

program
    .command("list")
    .description("list all the todos")
    .option("-p, --priority <level>", "Filter by priority (high, medium, low)")
    .action((options) => {
        listTodos(options.priority);
    })

program
    .command("delete <index>")
    .description("Delete a todo at specific index")
    .action((index) => {
        const todos = sortByPriority(getTodos());
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid number from the list."));
            return ;
        }
        const removedTodo = todos.splice(todoIndex, 1);
        saveTodos(todos);
        console.log(chalk.yellow(`🗑️  Deleted: "${removedTodo[0].title}"`));
        listTodos();
    })

function listTodos(filterPriority = null) {
    let todos = getTodos();
    
    // Add default priority for old todos (backwards compatibility)
    todos = todos.map(t => ({ ...t, priority: t.priority || "medium" }));
    
    // Sort by priority (high first, then medium, then low)
    todos = sortByPriority(todos);
    
    // Filter by priority if specified
    if (filterPriority && ["high", "medium", "low"].includes(filterPriority)) {
        todos = todos.filter(t => t.priority === filterPriority);
    }
    
    if (todos.length === 0) {
        console.log(chalk.dim("\n  📭 No todos yet. Add one with: todo add \"your task\""));
        return;
    }
    console.log(chalk.cyan.bold("\n  ╔════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("  ║") + chalk.white.bold("         📋 YOUR TODOS             ") + chalk.cyan.bold("║"));
    console.log(chalk.cyan.bold("  ╠════════════════════════════════════╣"));
    todos.forEach((todo, index) => {
        const p = PRIORITIES[todo.priority || "medium"];
        const status = todo.completed 
            ? chalk.green.bold(" ✓ Done   ") 
            : chalk.red.bold(" ○ Pending");
        const title = todo.completed 
            ? chalk.dim.strikethrough(todo.title) 
            : chalk.white(todo.title);
        const num = chalk.gray(`  ${(index + 1).toString().padStart(2, ' ')}.`);
        console.log(`${num} ${p.icon} ${title}`);
        console.log(`      ${status} | ${p.color(p.label)}`);
    });
    console.log(chalk.cyan.bold("  ╚════════════════════════════════════╝\n"));
}

program
    .command("update <index>")
    .description("update if task is completed or not")
    .action((index) => {
        const todos = sortByPriority(getTodos());
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid todo number."));
            return ;
        }
        todos[todoIndex].completed = !todos[todoIndex].completed;
        saveTodos(todos);
        const status = todos[todoIndex].completed ? chalk.green("completed ✓") : chalk.yellow("pending");
        console.log(chalk.blue(`🔄 Marked "${todos[todoIndex].title}" as ${status}`));
        listTodos();

    })

program
    .command("edit <index> <newtask>")
    .description("Edit the specific todo with given index")
    .action((index, newtask) => {
        const todos = sortByPriority(getTodos());
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid todo number."));
            return;
        }
        const oldTask = todos[todoIndex].title;
        todos[todoIndex].title = newtask;
        saveTodos(todos);
        console.log(chalk.blue(`✏️  Updated: "${chalk.dim(oldTask)}" → "${chalk.white(newtask)}"`));
        listTodos();
    })

program
    .command("priority <index> <level>")
    .description("Change priority of a todo (high, medium, low)")
    .action((index, level) => {
        const todos = sortByPriority(getTodos());
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error(chalk.red("❌ Invalid number! Please enter a valid todo number."));
            return;
        }
        if(!["high", "medium", "low"].includes(level)) {
            console.error(chalk.red("❌ Invalid priority! Use: high, medium, or low"));
            return;
        }
        const oldPriority = todos[todoIndex].priority || "medium";
        todos[todoIndex].priority = level;
        saveTodos(todos);
        const p = PRIORITIES[level];
        console.log(chalk.blue(`🏷️  Changed "${todos[todoIndex].title}" from ${oldPriority} → ${p.icon} ${p.color(level)}`));
        listTodos();
    })

program 
    .command("clear")
    .description("deletes all the completed todos")
    .action(() => {
        const todos = getTodos();
        const completedCount = todos.filter(t => t.completed).length;
        const newTodos = todos.filter((todo) => !todo.completed);
        saveTodos(newTodos);
        console.log(chalk.yellow(`🧹 Cleared ${completedCount} completed todo(s)`));
        listTodos();
    })

program
    .command("search <keyword>")
    .description("Find todos containing specific text")
    .action((keyword) => {
        const todos = sortByPriority(getTodos());
        const searchedTodos = todos.filter(todo => 
            todo.title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (searchedTodos.length === 0) {
            console.log(chalk.yellow(`\n  🔍 No todos found matching "${keyword}"\n`));
            return;
        }
        
        console.log(chalk.magenta.bold(`\n  ╔════════════════════════════════════╗`));
        console.log(chalk.magenta.bold(`  ║`) + chalk.white.bold(`   🔍 Results for "${keyword}"`.padEnd(35)) + chalk.magenta.bold(`║`));
        console.log(chalk.magenta.bold(`  ╠════════════════════════════════════╣`));
        searchedTodos.forEach((todo, index) => {
            const p = PRIORITIES[todo.priority || "medium"];
            const status = todo.completed 
                ? chalk.green.bold(" ✓ Done   ") 
                : chalk.red.bold(" ○ Pending");
            const title = todo.completed 
                ? chalk.dim.strikethrough(todo.title) 
                : chalk.white(todo.title);
            const num = chalk.gray(`  ${(index + 1).toString().padStart(2, ' ')}.`);
            console.log(`${num} ${p.icon} ${title}`);
            console.log(`      ${status} | ${p.color(p.label)}`);
        });
        console.log(chalk.magenta.bold(`  ╚════════════════════════════════════╝\n`));
    })

program
    .command("stats")
    .description("Show total, completed, pending counts")
    .action(() => {
        const todos = getTodos();
        const completed = todos.filter(t => t.completed).length;
        const pending = todos.length - completed;
        const progress = todos.length === 0 ? 0 : ((completed/todos.length)*100).toFixed(1);
        
        // Priority counts
        const highCount = todos.filter(t => t.priority === "high").length;
        const mediumCount = todos.filter(t => (t.priority || "medium") === "medium").length;
        const lowCount = todos.filter(t => t.priority === "low").length;
        
        // Progress bar
        const barLength = 20;
        const filledLength = Math.round((progress / 100) * barLength);
        const bar = chalk.green('█'.repeat(filledLength)) + chalk.gray('░'.repeat(barLength - filledLength));
        
        console.log(chalk.blue.bold(`\n  ╔════════════════════════════════════╗`));
        console.log(chalk.blue.bold(`  ║`) + chalk.white.bold(`       📊 TODO STATISTICS          `) + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
        console.log(chalk.blue.bold(`  ║`) + `  📝 Total:     ${chalk.white.bold(todos.length.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ║`) + `  ✅ Completed: ${chalk.green.bold(completed.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ║`) + `  ⏳ Pending:   ${chalk.red.bold(pending.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
        console.log(chalk.blue.bold(`  ║`) + `  🔴 High:      ${chalk.red.bold(highCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ║`) + `  🟡 Medium:    ${chalk.yellow.bold(mediumCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ║`) + `  🟢 Low:       ${chalk.green.bold(lowCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
        console.log(chalk.blue.bold(`  ║`) + `  ${bar} ${progress}%  ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ╚════════════════════════════════════╝\n`));
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
    const todos = getTodos();
    const total = todos.length;
    const done = todos.filter(t => t.completed).length;
    const pending = total - done;
    const high = todos.filter(t => t.priority === 'high' && !t.completed).length;
    const progress = total === 0 ? 0 : Math.round((done / total) * 100);
    
    const barLen = 25;
    const filled = Math.round((progress / 100) * barLen);
    const bar = chalk.hex('#8b5cf6')('━'.repeat(filled)) + chalk.gray('━'.repeat(barLen - filled));
    
    console.log(chalk.dim('  ┌─────────────────────────────────────────────┐'));
    console.log(chalk.dim('  │') + `  📊 ${chalk.white.bold(total)} tasks  ${chalk.green('✓' + done)}  ${chalk.yellow('○' + pending)}  ${high > 0 ? chalk.red('🔴' + high + ' urgent') : ''}`.padEnd(55) + chalk.dim('│'));
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
                    { name: '  📋  View All Todos', value: 'list' },
                    { name: '  ➕  Add New Todo', value: 'add' },
                    { name: '  ✅  Toggle Complete/Pending', value: 'update' },
                    { name: '  ✏️   Edit Todo', value: 'edit' },
                    { name: '  🏷️   Change Priority', value: 'priority' },
                    new inquirer.Separator(chalk.dim(' ─── Manage ────────────────')),
                    { name: '  🗑️   Delete Todo', value: 'delete' },
                    { name: '  🧹  Clear Completed', value: 'clear' },
                    new inquirer.Separator(chalk.dim(' ─── Info ──────────────────')),
                    { name: '  🔍  Search Todos', value: 'search' },
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
                    { name: '  All Todos', value: null },
                    { name: '  🔴 High Only', value: 'high' },
                    { name: '  🟡 Medium Only', value: 'medium' },
                    { name: '  🟢 Low Only', value: 'low' },
                ]
            }]);
            listTodos(filterChoice);
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
            const todos = getTodos();
            todos.push({ title: task.trim(), completed: false, id: Date.now(), priority });
            saveTodos(todos);
            const p = PRIORITIES[priority];
            console.log(chalk.green(`\n  ✨ Added: "${task.trim()}" ${p.icon} ${p.color(p.label)}`));
            listTodos();
            break;
        }

        case 'update': {
            const todos = sortByPriority(getTodos());
            if (todos.length === 0) { console.log(chalk.dim('  📭 No todos to update.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which todo to toggle?',
                choices: todos.map((t, i) => ({
                    name: `  ${(i+1).toString().padStart(2)}. ${PRIORITIES[t.priority||'medium'].icon} ${t.completed ? chalk.dim.strikethrough(t.title) : t.title} ${t.completed ? chalk.green('✓') : chalk.red('○')}`,
                    value: i
                })),
                pageSize: 15
            }]);
            todos[selected].completed = !todos[selected].completed;
            saveTodos(todos);
            const status = todos[selected].completed ? chalk.green('completed ✓') : chalk.yellow('pending');
            console.log(chalk.blue(`\n  🔄 Marked "${todos[selected].title}" as ${status}`));
            listTodos();
            break;
        }

        case 'edit': {
            const todos = sortByPriority(getTodos());
            if (todos.length === 0) { console.log(chalk.dim('  📭 No todos to edit.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which todo to edit?',
                choices: todos.map((t, i) => ({
                    name: `  ${(i+1).toString().padStart(2)}. ${PRIORITIES[t.priority||'medium'].icon} ${t.title}`,
                    value: i
                })),
                pageSize: 15
            }]);
            const { newtask } = await inquirer.prompt([{
                type: 'input',
                name: 'newtask',
                message: `New text (current: "${todos[selected].title}"):`,
                default: todos[selected].title,
                validate: input => input.trim() ? true : 'Task cannot be empty!'
            }]);
            const oldTask = todos[selected].title;
            todos[selected].title = newtask.trim();
            saveTodos(todos);
            console.log(chalk.blue(`\n  ✏️  Updated: "${chalk.dim(oldTask)}" → "${chalk.white(newtask.trim())}"`));
            listTodos();
            break;
        }

        case 'priority': {
            const todos = sortByPriority(getTodos());
            if (todos.length === 0) { console.log(chalk.dim('  📭 No todos.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Change priority for which todo?',
                choices: todos.map((t, i) => ({
                    name: `  ${(i+1).toString().padStart(2)}. ${PRIORITIES[t.priority||'medium'].icon} ${t.title} [${(t.priority||'medium').toUpperCase()}]`,
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
                default: todos[selected].priority || 'medium'
            }]);
            todos[selected].priority = level;
            saveTodos(todos);
            const p = PRIORITIES[level];
            console.log(chalk.blue(`\n  🏷️  Changed "${todos[selected].title}" → ${p.icon} ${p.color(level)}`));
            listTodos();
            break;
        }

        case 'delete': {
            const todos = sortByPriority(getTodos());
            if (todos.length === 0) { console.log(chalk.dim('  📭 No todos to delete.')); break; }
            const { selected } = await inquirer.prompt([{
                type: 'list',
                name: 'selected',
                message: 'Which todo to delete?',
                choices: todos.map((t, i) => ({
                    name: `  ${(i+1).toString().padStart(2)}. ${PRIORITIES[t.priority||'medium'].icon} ${t.title}`,
                    value: i
                })),
                pageSize: 15
            }]);
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `Delete "${todos[selected].title}"?`,
                default: false
            }]);
            if (confirm) {
                const removed = todos.splice(selected, 1);
                saveTodos(todos);
                console.log(chalk.yellow(`\n  🗑️  Deleted: "${removed[0].title}"`));
            } else {
                console.log(chalk.dim('  Cancelled.'));
            }
            listTodos();
            break;
        }

        case 'clear': {
            const todos = getTodos();
            const completedCount = todos.filter(t => t.completed).length;
            if (completedCount === 0) {
                console.log(chalk.dim('  No completed todos to clear.'));
                break;
            }
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `Clear ${completedCount} completed todo(s)?`,
                default: true
            }]);
            if (confirm) {
                const newTodos = todos.filter(t => !t.completed);
                saveTodos(newTodos);
                console.log(chalk.yellow(`\n  🧹 Cleared ${completedCount} completed todo(s)`));
            }
            listTodos();
            break;
        }

        case 'search': {
            const { keyword } = await inquirer.prompt([{
                type: 'input',
                name: 'keyword',
                message: 'Search for:',
                validate: input => input.trim() ? true : 'Enter a keyword!'
            }]);
            const todos = sortByPriority(getTodos());
            const results = todos.filter(t => t.title.toLowerCase().includes(keyword.toLowerCase().trim()));
            if (results.length === 0) {
                console.log(chalk.yellow(`\n  🔍 No todos found matching "${keyword.trim()}"`));
            } else {
                console.log(chalk.magenta.bold(`\n  ╔════════════════════════════════════╗`));
                console.log(chalk.magenta.bold(`  ║`) + chalk.white.bold(`   🔍 Results for "${keyword.trim()}"`.padEnd(35)) + chalk.magenta.bold(`║`));
                console.log(chalk.magenta.bold(`  ╠════════════════════════════════════╣`));
                results.forEach((todo, index) => {
                    const p = PRIORITIES[todo.priority || 'medium'];
                    const status = todo.completed ? chalk.green.bold(' ✓ Done   ') : chalk.red.bold(' ○ Pending');
                    const title = todo.completed ? chalk.dim.strikethrough(todo.title) : chalk.white(todo.title);
                    console.log(`  ${chalk.gray((index+1).toString().padStart(2)+'.')} ${p.icon} ${title}`);
                    console.log(`      ${status} | ${p.color(p.label)}`);
                });
                console.log(chalk.magenta.bold(`  ╚════════════════════════════════════╝`));
            }
            console.log('');
            break;
        }

        case 'stats': {
            const todos = getTodos();
            const completed = todos.filter(t => t.completed).length;
            const pending = todos.length - completed;
            const progress = todos.length === 0 ? 0 : ((completed/todos.length)*100).toFixed(1);
            const highCount = todos.filter(t => t.priority === 'high').length;
            const mediumCount = todos.filter(t => (t.priority || 'medium') === 'medium').length;
            const lowCount = todos.filter(t => t.priority === 'low').length;
            const barLength = 20;
            const filledLength = Math.round((progress / 100) * barLength);
            const bar = chalk.green('█'.repeat(filledLength)) + chalk.gray('░'.repeat(barLength - filledLength));
            
            console.log(chalk.blue.bold(`\n  ╔════════════════════════════════════╗`));
            console.log(chalk.blue.bold(`  ║`) + chalk.white.bold(`       📊 TODO STATISTICS          `) + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
            console.log(chalk.blue.bold(`  ║`) + `  📝 Total:     ${chalk.white.bold(todos.length.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ║`) + `  ✅ Completed: ${chalk.green.bold(completed.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ║`) + `  ⏳ Pending:   ${chalk.red.bold(pending.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
            console.log(chalk.blue.bold(`  ║`) + `  🔴 High:      ${chalk.red.bold(highCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ║`) + `  🟡 Medium:    ${chalk.yellow.bold(mediumCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ║`) + `  🟢 Low:       ${chalk.green.bold(lowCount.toString().padStart(3))}               ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ╠════════════════════════════════════╣`));
            console.log(chalk.blue.bold(`  ║`) + `  ${bar} ${progress}%  ` + chalk.blue.bold(`║`));
            console.log(chalk.blue.bold(`  ╚════════════════════════════════════╝\n`));
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
