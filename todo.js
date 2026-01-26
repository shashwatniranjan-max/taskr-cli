#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {program} = require("commander");
const chalk = require("chalk");

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




program.parse();
