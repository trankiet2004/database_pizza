const express =require('express');
const app = express();
const cors=require('cors');
const sql = require('mssql');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/Front_End`));

const config = require('./config/db'); // Kết nối từ tệp db.js
const authRoutes = require('./routes/auth');


app.use('/', authRoutes);
app.get('/pizza', async (req, res) => {
    try {
        const Kich_co = ''
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('KichCo', sql.NVarChar, Kich_co) // Truyền tham số an toàn
        .query('EXEC GetMonAnBySize @KichCo = @KichCo'); // Gọi stored procedure

        res.json(result.recordset);
  
    } catch (err) {
      console.error('Lỗi:', err.message);
      res.status(500).send('Đã xảy ra lỗi');
    }
});

app.listen(8000, () => {
    console.log("The Server for pizza store is running in http://localhost:8000")
})