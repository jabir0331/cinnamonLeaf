// server/controllers/orderController.js
const Order = require("../models/Order");
const { resolveOrderItems } = require("../utils/orderPricing");

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryInfo, orderNumber, paymentMethod, paymentStatus } = req.body;

    // Re-price every item against MongoDB - never trust the price/total the client sent
    const { items: resolvedItems, totalAmount } = await resolveOrderItems(items);

    const order = new Order({
      orderNumber,
      items: resolvedItems,
      deliveryInfo,
      totalAmount,
      paymentMethod,
      paymentStatus,
      userId: req.user.id
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(orders);
    
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email'); // Optional: populate user info
    
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
