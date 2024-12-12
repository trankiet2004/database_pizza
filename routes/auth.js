// const express = require('express');
// const authController = require('../controllers/authController');
// const Employee = require('../model/employee');

// const router = express.Router();
// router.post('/register', authController.register);
// router.post('/login', authController.login);
// module.exports = router;
const express = require('express')
const authController = require('../controllers/authController')

const router = express.Router()
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/listemployee',authController.listEmployee);
router.get('/searchEmployee/:id',authController.searchEmployee);
router.delete('/deleteEmployee/:id',authController.deleteEmployee);
router.patch('/updateEmployee/:id', authController.updateEmployee)
module.exports = router;
