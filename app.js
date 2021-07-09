var inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');

let roles;
let departments;
let managers;
let employees;


// Start server after DB connection and begin prompts
db.connect(err => {
  if (err) throw err
  console.log('Database connected.')
  init();
  //need to run these first so that they query data base upon connection
  getRoles();
  getManagers();
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

      case "Add an employee":
        addEmployee();
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
    //console.log(answers);
    //running through names array to get index
    for (i = 0; i < names.length; i++) {
      //using index to get ID in ID array
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

getRoles = () => {
  db.query("SELECT id, title FROM roles", (err, res) => {
    if (err) throw err;
    roles = res;
    //console.table(roles);
  })
};

getManagers = () => {
  db.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
    if (err) throw err;
    managers = res;
    //console.table(managers);
  })
};

addEmployee = () => {

  getRoles();
  getManagers();

  let roleChoice = [];
  let roleId = [];
  for (i = 0; i < roles.length; i++) {
    roleChoice.push(roles[i].title)
    roleId.push(roles[i].id);
  }

  let managerChoice = [];
  let managerId = [];
  for (i = 0; i < managers.length; i++) {
    managerChoice.push(managers[i].first_name)
    managerId.push(managers[i].id);
  }

  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of the new employee?',
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of the new employee?',
    },
    {
      type: 'list',
      name: 'roleEmp',
      message: 'What is the role of the new employee?',
      choices: roleChoice
    },
    {
      type: 'list',
      name: 'managerEmp',
      message: 'Who is the manager of the new employee?',
      choices: managerChoice
    }
  ]).then(answer => {
    console.log(answer)
    for (i = 0; i < roleChoice.length; i++) {
      if (roleChoice[i] === answer.roleEmp) {
        console.log(roleId[i])
      }
    }

    for (i = 0; i < managerChoice.length; i++) {
      if (managerChoice[i] === answer.managerEmp) {
        console.log(managerId[i])
      }
    }

    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${roleId[i]}', '${managerId[i]})`, (err, res) => {

      console.log(`You successfully added ${answer.firstName} ${answer.lastName}`)
      viewAllEmployees();
    }
    )
  })
}
