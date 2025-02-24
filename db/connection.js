require("dotenv").config();
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_DBNAME,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USERNAME,
});

con.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1); // Stop the server if DB fails
  } else {
    console.log("✅ Connected to Clever Cloud database!");
  }
});

module.exports = con;
