#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {program} = require("commander");
const chalk = require("chalk");

const todoFilePath = path.join(__dirname, "todos.json");

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

program
    .command("add <task>")
    .description("Add a new todo task")
    .action((task) => {
        const todos = getTodos();
        todos.push({title: task, completed: false, id: Date.now()});
        saveTodos(todos);
        console.log(chalk.green(`✨ Added: "${task}"`));
        listTodos();
    })

program
    .command("list")
    .description("list all the todos")
    .action(() => {
        listTodos();
    })

program
    .command("delete <index>")
    .description("Delete a todo at specific index")
    .action((index) => {
        const todos = getTodos();
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

function listTodos() {
    const todos = getTodos();
    if (todos.length === 0) {
        console.log(chalk.dim("\n  📭 No todos yet. Add one with: todo add \"your task\""));
        return;
    }
    console.log(chalk.cyan.bold("\n  ╔════════════════════════════════════╗"));
    console.log(chalk.cyan.bold("  ║") + chalk.white.bold("         📋 YOUR TODOS             ") + chalk.cyan.bold("║"));
    console.log(chalk.cyan.bold("  ╠════════════════════════════════════╣"));
    todos.forEach((todo, index) => {
        const status = todo.completed 
            ? chalk.green.bold(" ✓ Done   ") 
            : chalk.red.bold(" ○ Pending");
        const title = todo.completed 
            ? chalk.dim.strikethrough(todo.title) 
            : chalk.white(todo.title);
        const num = chalk.gray(`  ${(index + 1).toString().padStart(2, ' ')}.`);
        console.log(`${num} ${title}`);
        console.log(`      ${status}`);
    });
    console.log(chalk.cyan.bold("  ╚════════════════════════════════════╝\n"));
}

program
    .command("update <index>")
    .description("update if task is completed or not")
    .action((index) => {
        const todos = getTodos();
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
        const todos = getTodos();
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
        const todos = getTodos();
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
            const status = todo.completed 
                ? chalk.green.bold(" ✓ Done   ") 
                : chalk.red.bold(" ○ Pending");
            const title = todo.completed 
                ? chalk.dim.strikethrough(todo.title) 
                : chalk.white(todo.title);
            const num = chalk.gray(`  ${(index + 1).toString().padStart(2, ' ')}.`);
            console.log(`${num} ${title}`);
            console.log(`      ${status}`);
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
        console.log(chalk.blue.bold(`  ║`) + `  ${bar} ${progress}%  ` + chalk.blue.bold(`║`));
        console.log(chalk.blue.bold(`  ╚════════════════════════════════════╝\n`));
    })

program.parse();