const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
const authRoutes = require('./routes/auth');
// const DbService = require('./model/employee.js');
dotenv.config();
// const checkInstances =DbService.getInstance();
app.use('/', authRoutes);
app.listen(process.env.PORT||3333,()=>{
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})
