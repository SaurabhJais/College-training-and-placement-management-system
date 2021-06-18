const mysql = require("mysql2")

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "tpo",
    password: "Saurabh@123",
    multipleStatements: true
})


module.exports = pool.promise();