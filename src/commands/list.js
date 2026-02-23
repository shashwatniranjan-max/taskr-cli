const { listTasks } = require("../utils/display");

function registerListCommand(program) {
    program
        .command("list")
        .description("List all the tasks")
        .option("-p, --priority <level>", "Filter by priority (high, medium, low)")
        .action((options) => {
            listTasks(options.priority);
            process.exit(0);
        });
}

module.exports = registerListCommand;
