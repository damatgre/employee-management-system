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

viewAllDepartments = () => {
  db.query('SELECT * FROM department', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

viewAllRoles = () => {
  db.query('SELECT * FROM roles', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

viewAllEmployees = () => {
  db.query('SELECT * FROM employee', (err, res) => {
    if (err) {
      throw err;
    }
    console.table(res);
    init();
  });
};

addDepartment = () => {

  inquirer.prompt([
    {
      type: 'input',
      name: 'deptName',
      message: 'What is the name of the new department?',
    }
  ]).then(answer => {
    db.query(`INSERT INTO department (name) VALUES ('${answer.deptName}')`, (err, res) => {
      if (err) throw err;
      console.log(`You successfully added ${answer.deptName} to the database!`);
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

addRole = () => {

  let names = [];
  let deptID = [];
  db.query(`SELECT * FROM department`, (err, res) => {
    //console.log(res);
    for (i = 0; i < res.length; i++) {
      names.push(res[i].name);
      deptID.push(res[i].id);
    }
  })


  inquirer.prompt([
    {
      type: 'input',
      name: 'inputTitle',
      message: 'What is the title of the new role?',
    },
    {
      type: 'input',
      name: 'inputSalary',
      message: 'What is the salary of the new role?',
    },
    {
      type: 'list',
      name: 'deptSelect',
      message: 'What department is this role a part of?',
      choices: names
    }
  ]).then(answers => {
    id = [];
    console.log(answers);
    for (i = 0; i < names.length; i++) {
      if (names[i] === answers.deptSelect) {
        //console.log(deptID[i])
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.inputTitle}', '${answers.inputSalary}', '${deptID[i]}')`, (err, res) => {
          if (err) throw err;
          console.log(`You successfully added ${answers.title} and ${answers.inputSalary} to the database!`);
          return viewAllRoles();
        })
      }
    }
  })
};