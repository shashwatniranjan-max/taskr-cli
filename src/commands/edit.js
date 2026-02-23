const chalk = require("chalk");
const { getTasks, saveTasks, sortByPriority } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerEditCommand(program) {
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
        });
}

module.exports = registerEditCommand;
