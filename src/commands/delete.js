const chalk = require("chalk");
const { getTasks, saveTasks, sortByPriority } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerDeleteCommand(program) {
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
        });
}

module.exports = registerDeleteCommand;
