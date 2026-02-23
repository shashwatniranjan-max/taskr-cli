const registerAddCommand = require("./add");
const registerListCommand = require("./list");
const registerDeleteCommand = require("./delete");
const registerUpdateCommand = require("./update");
const registerEditCommand = require("./edit");
const registerPriorityCommand = require("./priority");
const registerClearCommand = require("./clear");
const registerRemoveAllCommand = require("./removeAll");
const registerSearchCommand = require("./search");
const registerStatsCommand = require("./stats");

function registerAllCommands(program) {
    registerAddCommand(program);
    registerListCommand(program);
    registerDeleteCommand(program);
    registerUpdateCommand(program);
    registerEditCommand(program);
    registerPriorityCommand(program);
    registerClearCommand(program);
    registerRemoveAllCommand(program);
    registerSearchCommand(program);
    registerStatsCommand(program);
}

module.exports = registerAllCommands;
