const chalk = require("chalk");
const { PRIORITIES, PB, ACCENT_NUM, STATUS_DONE, STATUS_PEND } = require("./theme");
const { getTasks, sortByPriority } = require("../services/taskService");

function listTasks(filterPriority = null) {
    let tasks = getTasks();

    // Add default priority for old tasks (backwards compatibility)
    tasks = tasks.map(t => ({ ...t, priority: t.priority || "medium" }));

    // Sort by priority (high first, then medium, then low)
    tasks = sortByPriority(tasks);

    // Filter by priority if specified
    if (filterPriority && ["high", "medium", "low"].includes(filterPriority)) {
        tasks = tasks.filter(t => t.priority === filterPriority);
    }

    if (tasks.length === 0) {
        console.log(chalk.dim("\n  📭 No tasks yet. Add one with: task add \"your task\""));
        return;
    }
    console.log(PB.bold("\n  ╔════════════════════════════════════╗"));
    console.log(PB.bold("  ║") + chalk.white.bold("         📋 YOUR TASKS             ") + PB.bold("║"));
    console.log(PB.bold("  ╠════════════════════════════════════╣"));
    tasks.forEach((task, index) => {
        const p = PRIORITIES[task.priority || "medium"];
        const status = task.completed
            ? STATUS_DONE.bold(" ✓ Done   ")
            : STATUS_PEND.bold(" ○ Pending");
        const title = task.completed
            ? chalk.dim.strikethrough(task.title)
            : chalk.white(task.title);
        const num = ACCENT_NUM(`  ${(index + 1).toString().padStart(2, ' ')}.`);
        console.log(`${num} ${p.color(p.icon)} ${title}`);
        console.log(`      ${status} ${chalk.dim('│')} ${p.color(p.label)}`);
    });
    console.log(PB.bold("  ╚════════════════════════════════════╝\n"));
}

function renderSearchResults(keyword, results) {
    if (results.length === 0) {
        console.log(chalk.yellow(`\n  🔍 No tasks found matching "${keyword}"\n`));
        return;
    }
    console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
    console.log(PB.bold(`  ║`) + chalk.white.bold(`   🔍 Results for "${keyword}"`.padEnd(35)) + PB.bold(`║`));
    console.log(PB.bold(`  ╠════════════════════════════════════╣`));
    results.forEach((task, index) => {
        const p = PRIORITIES[task.priority || "medium"];
        const status = task.completed
            ? STATUS_DONE.bold(" ✓ Done   ")
            : STATUS_PEND.bold(" ○ Pending");
        const title = task.completed
            ? chalk.dim.strikethrough(task.title)
            : chalk.white(task.title);
        const num = ACCENT_NUM(`  ${(index + 1).toString().padStart(2, ' ')}.`);
        console.log(`${num} ${p.color(p.icon)} ${title}`);
        console.log(`      ${status} ${chalk.dim('│')} ${p.color(p.label)}`);
    });
    console.log(PB.bold(`  ╚════════════════════════════════════╝\n`));
}

function renderStats(tasks) {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    const progress = tasks.length === 0 ? 0 : ((completed / tasks.length) * 100).toFixed(1);

    const highCount = tasks.filter(t => t.priority === "high").length;
    const mediumCount = tasks.filter(t => (t.priority || "medium") === "medium").length;
    const lowCount = tasks.filter(t => t.priority === "low").length;

    const barLength = 20;
    const filledLength = Math.round((progress / 100) * barLength);
    const bar = chalk.hex('#8b5cf6')('█'.repeat(filledLength)) + chalk.hex('#3b0764')('░'.repeat(barLength - filledLength));

    console.log(PB.bold(`\n  ╔════════════════════════════════════╗`));
    console.log(PB.bold(`  ║`) + chalk.white.bold(`       📊 TASK STATISTICS          `) + PB.bold(`║`));
    console.log(PB.bold(`  ╠════════════════════════════════════╣`));
    console.log(PB.bold(`  ║`) + `  📝 Total:     ${chalk.white.bold(tasks.length.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ║`) + `  ✅ Completed: ${STATUS_DONE.bold(completed.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ║`) + `  ⏳ Pending:   ${STATUS_PEND.bold(pending.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ╠════════════════════════════════════╣`));
    console.log(PB.bold(`  ║`) + `  ▲ High:       ${PRIORITIES.high.color.bold(highCount.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ║`) + `  ◆ Medium:     ${PRIORITIES.medium.color.bold(mediumCount.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ║`) + `  ▽ Low:        ${PRIORITIES.low.color.bold(lowCount.toString().padStart(3))}               ` + PB.bold(`║`));
    console.log(PB.bold(`  ╠════════════════════════════════════╣`));
    console.log(PB.bold(`  ║`) + `  ${bar} ${progress}%  ` + PB.bold(`║`));
    console.log(PB.bold(`  ╚════════════════════════════════════╝\n`));
}

module.exports = { listTasks, renderSearchResults, renderStats };
