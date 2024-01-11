require('dotenv').config()
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.connect((error) => {
    if (error) {
        console.log("Error Connecting to DB", error);
    } else {
        console.log("Successfully Connected to DB");
    }
});

module.exports = db;                                                                                                                                                                                                                                                                                                                                                                                  