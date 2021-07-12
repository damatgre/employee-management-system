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

  //create empty arrays to fill with necessary data for questions
  let managersArray = [];
  let rolesArray = [];

  //give all roles for answer choices
  db.query("select * from roles;", function (err, res) {
    // console.log({ res });
    for (let i = 0; i < res.length; i++) {
      //place information in new array for id and title. not two separate arrays.
      rolesArray.push({ id: res[i].id, title: res[i].title });
    }

    //only going to give first and last name of managers
    db.query("SELECT * FROM employee", function (err, val) {
      for (let i = 0; i < val.length; i++) {
        //id and name for managers
        managersArray.push({ id: val[i].id, firstName: val[i].first_name });
      }
      //console.log({ managers, roles });

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

        //create new array to display role titles for choices
        {
          type: 'list',
          name: 'role',
          message: 'What is the role of the new employee?',
          //mapping to title of role
          choices: rolesArray.map(role => role.title)
        },

        //create new array to display first name of managers
        {
          type: 'list',
          name: 'manager',
          message: 'Who is the manager of the new employee?',
          choices: managersArray.map(manager => manager.firstName)
        }
      ]).then(answer => {
        //console.log(answer)

        //using indexOf() to get id for role_id
        let role_id = rolesArray.map(role => role.title).indexOf(answer.role);
        console.log(role_id)
        //indexOf used new id so find works
        const manager_id = managersArray.find(manager => manager.firstName === answer.manager).id;
        console.log(manager_id)

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', '${role_id}', '${manager_id}');`, (err, res) => {
          if (err) throw err;
          console.log(`You successfully added ${answer.firstName} ${answer.lastName} to your database!`);
          viewAllEmployees();
          init();
        }
        )
      })
    })
  }
  )
}