const sql = require('mssql');

const config = {
    user: 'tks',
    password: '1234',
    server: 'LAPTOP-UT7CHC7C\\SQLEXPRESS', // Lưu ý "\\" để escape ký tự "\"
    database: 'users',
    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    port: 1433,
};
module.exports = config;