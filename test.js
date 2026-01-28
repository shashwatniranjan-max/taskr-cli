// Simple test for todo.js without a test framework
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const todoFilePath = path.join(__dirname, 'todos.json');

// Backup current todos.json
let backup;
if (fs.existsSync(todoFilePath)) {
  backup = fs.readFileSync(todoFilePath);
}

let testPassed = false;
try {
  // Remove todos.json for a clean test
  if (fs.existsSync(todoFilePath)) fs.unlinkSync(todoFilePath);
  execSync('node todo.js add "Test task from test"');
  const todos = JSON.parse(fs.readFileSync(todoFilePath, 'utf-8'));
  if (Array.isArray(todos) && todos.length > 0 && todos[0].title === 'Test task from test') {
    testPassed = true;
    console.log('Test passed!');
  } else {
    console.error('Test failed: Todo not added correctly');
    process.exit(1);
  }
} catch (err) {
  console.error('Test failed:', err.message);
  process.exit(1);
} finally {
  // Restore todos.json
  if (backup) {
    fs.writeFileSync(todoFilePath, backup);
  }
}
