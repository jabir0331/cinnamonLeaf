// server/routes/order
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware')
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.post('/create', authMiddleware, createOrder);
router.get('/myOrders', authMiddleware, getMyOrders);
router.get('/', getAllOrders); 
router.put('/:id/status', updateOrderStatus); 

// router.get('/', authMiddleware, getAllOrders);                   Upon implementing the admin login I will use this 2 routes
// router.put('/:id/status', authMiddleware, updateOrderStatus); 

module.exports = router;
