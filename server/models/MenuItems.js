// server/models/MenuItems.js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
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
            type: Number,
            required: true,
            min: 0
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
        signature: {
            type: Boolean
        },
        status: {
            type: String,
            enum: ['Available', 'Unavailable'],
            default: 'Available'
        },
        // createdAt: {
        //     type: Date,
        //     default: Date.now
        // }
    },
    { timestamps: true } // To handle createdAt and updatedAt
);


module.exports = mongoose.model("MenuItems", menuItemSchema);
