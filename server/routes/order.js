// server/routes/order
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const { createOrder, getMyOrders } = require('../controllers/orderController');

router.post('/create', authMiddleware, createOrder);
router.get('/myOrders', authMiddleware, getMyOrders);

module.exports = router;
