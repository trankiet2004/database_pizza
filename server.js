const express =require('express');
const app = express();
const sql = require('mssql');
const cors=require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const procedures = require('./procedure');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

const config = require('./config');
const createStoredProcedure = require('./procedure');
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
  });
app.get('/users',async(req,res)=>{
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Users');
        return res.json(result.recordset);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
})
createStoredProcedure();
app.post('/signup',async(req,res)=>{
   try{
    let name = req.body.fname;
    let email = req.body.email;
    let password = req.body.password;
    let dob=req.body.dateOfBirth;
    const createdAt = new Date();
    const pool = await sql.connect(config);
    const regis = await pool.request()
    .input('Fullname',sql.NVarChar,name)
    .input('Email',sql.VarChar,email)
    .input('DateOfBirth',sql.Date,dob)
    .input('Password',sql.NVarChar,password)
    .input('CreatedAt',sql.DateTime,createdAt)
    //.query('INSERT INTO Users VALUES(@FullName, @Email, @DateOfBirth, @CreatedAt, @Password)')
    .execute('sp_AddEmployee3');
    res.status(201).send('Đăng ký thành công!');
   }
   catch(err){
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
   }
})
// async function createTable() {
//     try {
//         // Kết nối đến SQL Server
//         const pool = await sql.connect(config);

//         // Câu lệnh SQL để tạo bảng
//         const createTableQuery = `
//             CREATE TABLE NhanVien (
//                 AccountID NVARCHAR(10) PRIMARY KEY, -- ID dạng ACC00001
//                 Username NVARCHAR(50) NOT NULL , -- Tên đăng nhập duy nhất
//                 Email NVARCHAR(100) NOT NULL UNIQUE,   -- Email duy nhất
//                 Password NVARCHAR(255) NOT NULL,       -- Mật khẩu mã hóa
//                 DateOfBirth DATE,
//                 CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Ngày tạo
//                 UpdatedAt DATETIME NULL                -- Ngày cập nhật
//             );
//         `;
//         // Thực thi lệnh SQL
//         await pool.request().query(createTableQuery);
//         console.log('Table Accounts created successfully!');
//     } catch (error) {
//         console.error('Error creating table:', error.message);
//     } 
// }

// // Gọi hàm để tạo bảng
// createTable();
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})