const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance =null;
dotenv.config()
const pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "Thanhphat2408",
    database: "restaurant",
}).promise()
module.exports = pool;
// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// const pool = mysql.createPool({
//     host: "127.0.0.1",
//     user: "root",
//     password: "Thanhphat2408",
//     database: "restaurant",
// });

// export default pool;
