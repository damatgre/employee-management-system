var inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');



// Start server after DB connection and begin prompts
db.connect(err => {
  if (err) throw err
  console.log('Database connected.')
  init();
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
  ]).then(answers => {

    switch(answers.menuChoices){
      case "View all departments":
      viewAllDepartments();
      break;
    }
  })
}

function viewAllDepartments(){
    db.query('SELECT * FROM department', (err, res) => {
        if (err) {
            throw err;
        } else {
          console.table(res);
        }
    });
}
