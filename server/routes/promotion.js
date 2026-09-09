// server/routes/promotion
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const adminMiddleware = require('../config/adminMiddleware')
const { createPromotion, getAllPromotions, updatePromotion, togglePromotionStatus } = require('../controllers/promotionController');

router.get('/viewAll', getAllPromotions);
router.post('/create', authMiddleware, adminMiddleware, createPromotion);
router.put('/update/:id', authMiddleware, adminMiddleware, updatePromotion);
router.patch('/toggle-status/:id', authMiddleware, adminMiddleware, togglePromotionStatus);

module.exports = router;
