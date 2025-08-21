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
    
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

