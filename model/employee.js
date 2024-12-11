// const mysql = require('mysql2');
const pool= require('../config/db');
let instance =null;
class Employee{
    static getInstance(){
        if(!instance) instance = new Employee();
        return instance;
    }
    async getAllNhanvien(){
        try{
            const query = "INSERT INTO employees (name, phone, birth_date, chef_flag, username, password) VALUES (?, ?, ?, ?, SHA2(?, 256), ?)";
            const [result] = await pool.query(query, [name, phone, birth_date, chef_flag, username, password]);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
    async addEmployee(name, phone, birth_date, chef_flag, username, password) {
        try {
            var isChef = (chef_flag === "FALSE") ? false : true;
            const query = "INSERT INTO employees (name, phone, birth_date, chef_flag, username, password) VALUES (?, ?, ?, ?, SHA2(?, 256), ?)";
            const [result] = await pool.query(query, [name, phone, birth_date, isChef, username, password]);
            return result;
        } catch (error) {
            console.error(error);
        }
    }
    
}
module.exports = Employee;
// import pool from '../config/db.js';

// let instance = null;

// class DbService {
//     static getInstance() {
//         if (!instance) instance = new DbService();
//         return instance;
//     }

//     async getAllNhanvien() {
//         try {
//             const [results] = await pool.query("SELECT * FROM employees;");
//             return results;
//         } catch (error) {
//             console.error(error);
//         }
//     }

//     async addEmployee(name, phone, birth_date, chef_flag, username, password) {
//         try {
//             const query = "INSERT INTO employees (name, phone, birth_date, chef_flag, username, password) VALUES (?, ?, ?, ?, SHA2(?, 256), ?)";
//             const [result] = await pool.query(query, [name, phone, birth_date, chef_flag, username, password]);
//             return result;
//         } catch (error) {
//             console.error(error);
//         }
//     }
// }

// export default DbService;
