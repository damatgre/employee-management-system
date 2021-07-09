var inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');



// Start server after DB connection and begin prompts
db.connect(err => {
  if (err) throw err
  console.log('Database connected.')
  init();
});

function init() {
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

    switch (answers.menuChoices) {

      case "View all departments":
        viewAllDepartments();
        break;

      case "View all roles":
        viewAllRoles();
        break;

      case "View all employees":
        viewAllEmployees();
        break;

      case "Add a department":
        addDepartment();
        break;

      case "Add a role":
        addRole();
        break;
    }
  })
}

function viewAllDepartments() {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

function viewAllRoles() {
  db.query('SELECT * FROM roles', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

function viewAllEmployees() {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

function addDepartment() {

  inquirer.prompt([
    {
      type: 'input',
      name: 'deptName',
      message: 'What is the name of the new department?',
    }
  ]).then(answer => {
    db.query(`INSERT INTO department (name) VALUES ('${answer.deptName}')`, (err, res) => {
      if (err) throw err;
      console.log("1 new department added: " + answer.deptName);
      viewAllDepartments();
      init();
    })
  })
};
//     db.query(`INSERT INTO department SET ?`,
//       {
//         name: answer.deptName
//       }, (err, res) => {
//         if (err) {
//           throw err;
//         }
//         console.log(`You successfully added ${answer.deptName} to the departments!`, res);
//         init();
//       });
//   })
// };


