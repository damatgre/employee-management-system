const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  // Your MySQL username,
  user: 'root',
  // Your MySQL password
  password: 'B3ar5B33t5Battl3',
  database: 'employees_db'
});

module.exports = db;