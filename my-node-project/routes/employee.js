const express = require('express');
const router = express.Router();
const { Employee } = require('../models');

router.get('/', async (req, res) => {
    const employees = await Employee.findAll();
    res.json(employees);
});

module.exports = router;
