const chalk = require("chalk");
const gradient = require("gradient-string");

// Priority configuration with labels, colors, and icons
const PRIORITIES = {
    high: { label: "HIGH", color: chalk.hex('#fb7185'), icon: "▲" },
    medium: { label: "MED", color: chalk.hex('#c4b5fd'), icon: "◆" },
    low: { label: "LOW", color: chalk.hex('#67e8f9'), icon: "▽" }
};

// Unified purple theme colors
const PB = chalk.hex('#7c3aed');          // Primary border (violet)
const ACCENT_NUM = chalk.hex('#a78bfa');  // Number accent (light violet)
const STATUS_DONE = chalk.hex('#34d399'); // Completed (emerald)
const STATUS_PEND = chalk.hex('#fbbf24'); // Pending (amber)

// Gradients
const TASKR_GRADIENT = gradient(['#6366f1', '#8b5cf6', '#a855f7', '#d946ef']);
const ACCENT_GRADIENT = gradient(['#06b6d4', '#3b82f6', '#6366f1']);

module.exports = {
    PRIORITIES,
    PB,
    ACCENT_NUM,
    STATUS_DONE,
    STATUS_PEND,
    TASKR_GRADIENT,
    ACCENT_GRADIENT,
};
