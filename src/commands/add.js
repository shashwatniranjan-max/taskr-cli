const chalk = require("chalk");
const { PRIORITIES } = require("../utils/theme");
const { getTasks, saveTasks } = require("../services/taskService");
const { listTasks } = require("../utils/display");

function registerAddCommand(program) {
    program
        .command("add <task>")
        .description("Add a new task")
        .option("-p, --priority <level>", "Set priority (high, medium, low)", "medium")
        .action((task, options) => {
            const priority = ["high", "medium", "low"].includes(options.priority)
                ? options.priority
                : "medium";
            const tasks = getTasks();
            tasks.push({ title: task, completed: false, id: Date.now(), priority });
            saveTasks(tasks);
            const p = PRIORITIES[priority];
            console.log(chalk.green(`✨ Added: "${task}" ${p.icon} ${p.color(p.label)}`));
            listTasks();
            process.exit(0);
        });
}

module.exports = registerAddCommand;
