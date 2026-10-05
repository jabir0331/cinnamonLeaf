// models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }
});

const deliveryInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  address: { type: String, required: true },
  // Pin dropped on the map at checkout (optional - the typed address is still required)
  location: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 }
  },
  // Named places near the pin (looked up client-side) to help riders find the address
  landmarks: {
    type: [{
      _id: false,
      name: { type: String, trim: true, maxlength: 120 },
      kind: { type: String, trim: true, maxlength: 60 },
      distance: { type: Number, min: 0, max: 5000 }
    }],
    validate: [(list) => list.length <= 5, 'Too many landmarks']
  },
  specialNotes: { type: String }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  deliveryInfo: deliveryInfoSchema,
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cod', 'card'], required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  stripeSessionId: { type: String },
  // True when the customer had no delivered orders yet - new customers get a confirmation call
  isNewCustomer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);