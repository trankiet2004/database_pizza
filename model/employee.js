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
            const query = "INSERT INTO employees (name, phone, birth_date, chef_flag, username, password) VALUES (?, ?, ?, ?,?,  SHA2(?, 256))";
            const [result] = await pool.query(query, [name, phone, birth_date, isChef, username, password]);
            return result;
        } catch (error) {
            console.error(error);
        }
    }
    async checkEmployee(username,password){
        try{
            const query = "SELECT * FROM employees WHERE username =? AND password = SHA2(?, 256)";
            const [result] = await pool.query(query, [username, password]);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
}
module.exports = Employee;
