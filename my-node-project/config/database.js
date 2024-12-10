const mysql = require('mysql2');

// Tạo kết nối MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'example_db',
});

// Kết nối
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error: ', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

module.exports = db;