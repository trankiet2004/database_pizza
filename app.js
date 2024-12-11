const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());
const authRoutes = require('./routes/auth');
// const DbService = require('./model/employee.js');
dotenv.config();
// const checkInstances =DbService.getInstance();
app.use(express.static("Front_End"));

app.use('/', authRoutes);

app.listen(process.env.PORT||3333,()=>{
    console.log(`Server running on port http://localhost:${process.env.PORT}`);
})
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.js';

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors());

// dotenv.config();

// app.use('/', authRoutes);

// app.listen(process.env.PORT || 3333, () => {
//     console.log(`Server running on port ${process.env.PORT}`);
// });
