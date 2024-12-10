const express = require('express');
const router = express.Router();
const { Customer } = require('../models');

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo khách hàng mới
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const newCustomer = await Customer.create({ name, email, phone });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật thông tin khách hàng
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    customer.name = name;
    customer.email = email;
    customer.phone = phone;
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
