// server/routes/menu
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const adminMiddleware = require('../config/adminMiddleware')
const { createMenuItem, getAllMenuItems, updateMenuItem, toggleMenuItemStatus  } = require('../controllers/menuController');

router.get('/viewAll', getAllMenuItems);
router.post('/create', authMiddleware, adminMiddleware, createMenuItem);
router.put('/update/:id', authMiddleware, adminMiddleware, updateMenuItem);
router.patch('/toggle-status/:id', authMiddleware, adminMiddleware, toggleMenuItemStatus);


module.exports = router;
