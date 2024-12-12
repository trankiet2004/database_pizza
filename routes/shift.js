const express = require('express')
const shiftController = require('../controllers/shiftController')

const router = express.Router()

router.get('/getShifts', shiftController.getShifts);
router.post('/createShift', shiftController.createShift);
router.post('/register', shiftController.registershifts);
module.exports = router