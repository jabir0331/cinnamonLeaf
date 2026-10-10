// server/routes/order
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const adminMiddleware = require('../config/adminMiddleware')
const { createOrder, cancelUnpaidCardOrder, getOrderByNumber, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/create', authMiddleware, createOrder);
router.put('/:orderNumber/cancel', authMiddleware, cancelUnpaidCardOrder);
router.get('/myOrders', authMiddleware, getMyOrders);
router.get('/:orderNumber', authMiddleware, getOrderByNumber);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
