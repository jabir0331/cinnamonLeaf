// server/routes/menu
const express = require('express');
const router = express.Router();
const { getAllMenuItems } = require('../controllers/menuController');

router.get('/viewAll', getAllMenuItems);

module.exports = router;
