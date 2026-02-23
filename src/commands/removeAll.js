const chalk = require("chalk");
const inquirer = require("inquirer");
const { getTasks, saveTasks } = require("../services/taskService");

function registerRemoveAllCommand(program) {
    program
        .command("remove-all")
        .description("Delete ALL tasks (requires confirmation)")
        .action(async () => {
            const tasks = getTasks();
            if (tasks.length === 0) {
                console.log(chalk.dim('\n  📭 No tasks to remove.'));
                process.exit(0);
            }
            console.log(chalk.red.bold(`\n  ⚠️  WARNING: This will permanently delete ALL ${tasks.length} task(s)!`));
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: chalk.red(`Are you sure you want to delete all ${tasks.length} task(s)?`),
                default: false
            }]);
            if (!confirm) { console.log(chalk.dim('  Cancelled.')); process.exit(0); }
            const { typed } = await inquirer.prompt([{
                type: 'input',
                name: 'typed',
                message: chalk.red.bold('Type "DELETE ALL" to confirm:'),
            }]);
            if (typed.trim() === 'DELETE ALL') {
                saveTasks([]);
                console.log(chalk.red(`\n  💀 All ${tasks.length} task(s) have been permanently deleted.`));
            } else {
                console.log(chalk.dim('  Confirmation failed. No tasks were deleted.'));
            }
            process.exit(0);
        });
}

module.exports = registerRemoveAllCommand;
