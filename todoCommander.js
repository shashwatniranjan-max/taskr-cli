const fs = require("fs");
const path = require("path");
const {program} = require("commander");

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
        console.log(`Added the todo: ${task}`);
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
            console.error("invalid number please enter valid number from the list");
            return ;
        }
        const removedTodo = todos.splice(todoIndex, 1);
        saveTodos(todos);
        console.log(`Deleted todo : ${removedTodo[0].title}`);
        listTodos();
    })

function listTodos() {
    const todos = getTodos();
    console.log("------Todo list------");
    todos.forEach((todo, index) => {
        console.log(`${index+1}. ${todo.title} ${todo.completed ? "..✅Done" : "..❌Pending"} `);
    });
    console.log("----------------------");
}

program
    .command("update <index>")
    .description("update if task is completed or not")
    .action((index) => {
        const todos = getTodos();
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error("give a valid todo number to update");
            return ;
        }
        todos[todoIndex].completed = !todos[todoIndex].completed;
        saveTodos(todos);
        listTodos();

    })

program
    .command("edit <index> <newtask>")
    .description("Edit the specific todo with given index")
    .action((index, newtask) => {
        const todos = getTodos();
        const todoIndex = parseInt(index, 10) - 1;
        if(isNaN(todoIndex) || todoIndex < 0 || todoIndex >= todos.length) {
            console.error("invalid todo number ");
            return;
        }
        todos[todoIndex].title = newtask;
        saveTodos(todos);
        console.log(`updated the todo on number ${index}. with: ${newtask}`);
        listTodos();
    })

program 
    .command("clear")
    .description("deletes all the completed todos")
    .action(() => {
        const todos = getTodos();
        const newTodos = todos.filter((todo) => !todo.completed);
        saveTodos(newTodos);
        console.log("completed todos are cleared");
        listTodos();
    })

program
    .command("search")


program.parse();