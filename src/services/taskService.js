const fs = require("fs");
const path = require("path");

const taskFilePath = path.join(__dirname, "..", "..", "tasks.json");

const getTasks = () => {
    try {
        const data = fs.readFileSync(taskFilePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveTasks = (tasks) => {
    fs.writeFileSync(taskFilePath, JSON.stringify(tasks, null, 2));
};

const sortByPriority = (tasks) => {
    const order = { high: 0, medium: 1, low: 2 };
    return [...tasks].sort((a, b) => order[a.priority || "medium"] - order[b.priority || "medium"]);
};

module.exports = { getTasks, saveTasks, sortByPriority, taskFilePath };
