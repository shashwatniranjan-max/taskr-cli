const chalk = require("chalk");
const { PRIORITIES } = require("../utils/theme");
const { getTasks, saveTasks, sortByPriority } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerPriorityCommand(program) {
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
        });
}

module.exports = registerPriorityCommand;
