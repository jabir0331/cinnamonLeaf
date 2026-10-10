// server/controllers/orderController.js
const Order = require("../models/Order");
const { resolveOrderItems } = require("../utils/orderPricing");
const { assertWithinDeliveryZone } = require("../utils/deliveryZone");
const { COD_MAX_AMOUNT, ABANDONED_CARD_ORDER_MINUTES } = require("../config/orderRules");

// Card orders are saved before the customer pays. Ones never paid for (Stripe page closed or
// abandoned) are cancelled after a while so they don't linger as live orders.
const cancelAbandonedCardOrders = () =>
  Order.updateMany(
    {
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: { $lt: new Date(Date.now() - ABANDONED_CARD_ORDER_MINUTES * 60 * 1000) }
    },
    { orderStatus: "cancelled", updatedAt: Date.now() }
  );

exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryInfo, orderNumber, paymentMethod, paymentStatus } = req.body;

    // Only deliver within the restaurant's delivery radius
    assertWithinDeliveryZone(deliveryInfo);

    // Re-price every item against MongoDB - never trust the price/total the client sent
    const { items: resolvedItems, totalAmount } = await resolveOrderItems(items);

    // Larger orders must be prepaid by card, whether the customer is new or returning
    if (paymentMethod === "cod" && totalAmount > COD_MAX_AMOUNT) {
      throw new Error(`Cash on delivery is available for orders up to LKR ${COD_MAX_AMOUNT.toLocaleString("en-US")}. Please pay by card for larger orders.`);
    }

    // A customer with no delivered orders is new: staff confirm their first order by phone
    const deliveredOrders = await Order.countDocuments({ userId: req.user.id, orderStatus: "delivered" });

    const order = new Order({
      orderNumber,
      items: resolvedItems,
      deliveryInfo,
      totalAmount,
      paymentMethod,
      paymentStatus,
      isNewCustomer: deliveredOrders === 0,
      userId: req.user.id
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(400).json({ success: false, message: err.message });
  }
}

// The customer backed out of (or failed to start) card payment, so their unpaid order is cancelled.
// Only their own order, only while it is still an unpaid card order.
exports.cancelUnpaidCardOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        orderNumber: req.params.orderNumber,
        userId: req.user.id,
        paymentMethod: "card",
        paymentStatus: "pending",
        orderStatus: "pending"
      },
      { orderStatus: "cancelled", updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "No unpaid card order found to cancel" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// One of the signed-in customer's own orders, for the order confirmation page
exports.getOrderByNumber = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    await cancelAbandonedCardOrders();
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    console.log(orders);
    
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    await cancelAbandonedCardOrders();
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

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    // The rider collects the cash on delivery, so a delivered cash order has been paid
    if (status === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
