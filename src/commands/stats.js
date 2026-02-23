const { getTasks } = require("../services/taskService");
const { renderStats } = require("../utils/display");

function registerStatsCommand(program) {
    program
        .command("stats")
        .description("Show total, completed, pending counts")
        .action(() => {
            const tasks = getTasks();
            renderStats(tasks);
            process.exit(0);
        });
}

module.exports = registerStatsCommand;
