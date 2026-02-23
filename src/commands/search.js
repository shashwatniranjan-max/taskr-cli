const chalk = require("chalk");
const { getTasks, sortByPriority } = require("../services/taskService");
const { renderSearchResults } = require("../utils/display");

function registerSearchCommand(program) {
    program
        .command("search <keyword>")
        .description("Find tasks containing specific text")
        .action((keyword) => {
            const tasks = sortByPriority(getTasks());
            const searchedTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(keyword.toLowerCase())
            );
            renderSearchResults(keyword, searchedTasks);
            process.exit(0);
        });
}

module.exports = registerSearchCommand;
