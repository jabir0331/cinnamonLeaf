const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String, // keeping as String, to store "LKR 550"
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    spicy: {
        type: Boolean
    },
    vegetarian: {
        type: Boolean
    },
    popular: {
        type: Boolean
    }
});


module.exports = mongoose.model("MenuItems", menuItemSchema);
