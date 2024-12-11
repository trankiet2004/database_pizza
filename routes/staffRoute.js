const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/register', authController.register);
module.exports = router;
// import express from 'express';
// import { register } from '../controllers/authController.js';

// const router = express.Router();
// router.post('/register', register);

// export default router;
