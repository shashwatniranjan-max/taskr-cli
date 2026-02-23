const chalk = require("chalk");
const { getTasks, saveTasks } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerClearCommand(program) {
    program
        .command("clear")
        .description("Deletes all the completed tasks")
        .action(() => {
            const tasks = getTasks();
            const completedCount = tasks.filter(t => t.completed).length;
            const newTasks = tasks.filter((task) => !task.completed);
            saveTasks(newTasks);
            console.log(chalk.yellow(`🧹 Cleared ${completedCount} completed task(s)`));
            listTasks();
            process.exit(0);
        });
}

module.exports = registerClearCommand;
