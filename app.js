var inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');
const funk = require('./orm');


// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');

});

function init () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menuChoices',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role'
      ]
    }
  ])
}

