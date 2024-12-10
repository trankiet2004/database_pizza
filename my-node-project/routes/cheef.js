const express = require('express');
const router = express.Router();
const { Chef, Employee } = require('../models');

// Lấy danh sách tất cả đầu bếp
router.get('/', async (req, res) => {
  try {
    const chefs = await Chef.findAll({
      include: [
        {
          model: Employee, // Bao gồm thông tin Employee liên quan
          attributes: ['name', 'phone', 'salary'],
        },
      ],
    });
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tạo một đầu bếp mới
router.post('/', async (req, res) => {
  try {
    const { employeeId, experienceYears } = req.body;
    const newChef = await Chef.create({ employeeId, experienceYears });
    res.status(201).json(newChef);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật thông tin đầu bếp
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { experienceYears } = req.body;

    const chef = await Chef.findByPk(id);
    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    chef.experienceYears = experienceYears;
    await chef.save();
    res.json(chef);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Xóa một đầu bếp
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const chef = await Chef.findByPk(id);
    if (!chef) {
      return res.status(404).json({ error: 'Chef not found' });
    }

    await chef.destroy();
    res.json({ message: 'Chef deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
