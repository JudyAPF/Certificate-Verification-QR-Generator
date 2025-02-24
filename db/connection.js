const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  database: "certificate_verification_code_generator",
  password: "",
  user: "root",
});

module.exports = con;
