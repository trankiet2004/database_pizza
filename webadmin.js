const express =require('express');
const app = express();
const cors=require('cors');
// const sql = require('mssql');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/Front_End`));

const {sql,config} = require('./config/db'); // Kết nối từ tệp db.js
const authRoutes = require('./routes/auth');
const shiftRoutes = require('./routes/shift');


app.use('/', authRoutes);
app.use('/shift', shiftRoutes); // shift
app.get('/pizza', async (req, res) => {
    try {
        //const Kich_co = ''
        const pool = await sql.connect(config);
        const result = await pool.request()
        //.input('KichCo', sql.NVarChar, Kich_co) // Truyền tham số an toàn
        .execute('ViewLuaChonThucDonDetails'); // Gọi stored procedure

        res.json(result.recordset);
  
    } catch (err) {
      console.error('Lỗi:', err.message);
      res.status(500).send('Đã xảy ra lỗi');
    }
});

app.get('/pizza/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('ID_mon', sql.NVarChar, id) // Truyền tham số an toàn
        .execute('FindMonAnDetails'); // Gọi stored procedure
        res.status(200).json(result.recordset);
    }
    catch(err){
      console.error('L��i:', err.message);
      res.status(500).send('Đã xảy ra l��i');
    }
})

app.post('/pizza', async(req, res) => {
    try {
        const { TenThucDon, gia,loai, pizza_flag,Thucuong_flag,Kich_co,loai_mon } = req.body;
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('Ten_mon', sql.NVarChar, (TenThucDon))
        .input('GiaTien',sql.NVarChar, (gia))
        .input('Loai',sql.NVarChar,(loai))
        .input('Pizza_flag', sql.NVarChar,(pizza_flag))
        .input('Thuc_uong_flag', sql.NVarChar,(Thucuong_flag))
        .input('Kich_co',sql.NVarChar,(Kich_co))
        .input('Loai_mon',sql.NVarChar,(loai_mon))
        .execute('AddLuaChonThucDon')
        res.json(result.recordset);
    }
    catch(err){
      console.error('Lỗi:', err.message);
      res.status(500).send('Đã xảy ra lỗi');
    }
})

app.listen(8000, () => {
    console.log("The Server for pizza store is running in http://localhost:8000")
})