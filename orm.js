const db = require('./db/connection');

class ORM {

    findAllDepartments() {
        db.query(`SELECT * FROM department`);
    }

    findAllRoles() {
        db.query(`SELECT * FROM roles`);
    }

    
}

module.exports = ORM;