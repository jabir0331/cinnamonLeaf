// server/models/Promotion.js
const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        badgeText: {
            type: String,
            trim: true
        },
        validUntil: {
            type: Date
        },
        image: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
