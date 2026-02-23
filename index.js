#!/usr/bin/env node
const { program } = require("commander");
const chalk = require("chalk");
const registerAllCommands = require("./src/commands");
const interactiveMenu = require("./src/interactive/menu");

// Register all CLI commands
registerAllCommands(program);

// Route: interactive mode if no command given, otherwise commander handles it
if (process.argv.length <= 2) {
    interactiveMenu().catch(err => {
        if (err.isTtyError) {
            console.error(chalk.red('Interactive mode requires a TTY terminal.'));
        } else {
            console.error(chalk.red('Error:'), err.message);
        }
        process.exit(1);
    });
} else {
    program.parse();
}
