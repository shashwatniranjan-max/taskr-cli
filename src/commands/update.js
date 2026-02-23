const chalk = require("chalk");
const { getTasks, saveTasks, sortByPriority } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerUpdateCommand(program) {
    program
        .command("update <index>")
        .description("Update if task is completed or not")
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
        });
}

module.exports = registerUpdateCommand;
