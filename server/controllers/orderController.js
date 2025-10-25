// server/controllers/orderController.js
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  console.log("Body received:", req.body);
  console.log("User:", req.user);
  try {
    const order = new Order({
      ...req.body,
      userId: req.user.id   
    });
    console.log(req);
    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.log(req);
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
