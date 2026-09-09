// server/routes/category
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const adminMiddleware = require('../config/adminMiddleware')
const { createCategory, getAllCategories, updateCategory, toggleCategoryStatus } = require('../controllers/categoryController');

router.get('/viewAll', getAllCategories);
router.post('/create', authMiddleware, adminMiddleware, createCategory);
router.put('/update/:id', authMiddleware, adminMiddleware, updateCategory);
router.patch('/toggle-status/:id', authMiddleware, adminMiddleware, toggleCategoryStatus);

module.exports = router;
