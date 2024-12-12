const {sql, config} = require('../config/db');
let instance = null;
class Employee{
    static getInstance(){
        if(!instance) instance = new Employee();
        return instance;
    }
    async addEmployee(name,phone,birth_date,chef_flag,username,password){
        try{
            let pool = await sql.connect(config);
            const result = await pool.request()
            .input('name',sql.VarChar,(name))
            .input('phone',sql.VarChar,(phone))
            .input('birth_date',sql.Date,(birth_date))
            .input('chef_flag',sql.Bit,(chef_flag === "FALSE" ? 1 : 0))
            .input('username',sql.VarChar,(username))
            .input('password',sql.VarChar,(password))
            .execute('spCreateUser');
            
            result.send('User registered successfully');
        } catch (err) {
            console.error(err);
        }
    }
}
module.exports = Employee; 