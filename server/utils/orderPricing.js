// server/utils/orderPricing.js
const mongoose = require('mongoose');
const MenuItems = require('../models/MenuItems');

// Upper bound per line item, to catch typos and abuse
const MAX_ITEM_QUANTITY = 100;

// MenuItems.price is a validated Number at the schema level; this just
// guards against a corrupt/missing value before it's trusted for a charge.
const parsePrice = (price) => {
    return Number.isFinite(price) && price >= 0 ? price : null;
};

// Re-prices a client-submitted cart against the database: looks each item up
// by its MenuItems _id and uses the stored name/price/category, ignoring
// whatever the client sent for those fields. Throws with a user-facing
// message if any item can't be trusted (missing, unavailable, bad id).
async function resolveOrderItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items are required');
    }

    const validIds = [...new Set(
        items.map(item => item && item.id).filter(id => mongoose.Types.ObjectId.isValid(id))
    )];

    const menuItems = await MenuItems.find({ _id: { $in: validIds } });
    const menuItemsById = new Map(menuItems.map(mi => [mi._id.toString(), mi]));

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
        const menuItem = menuItemsById.get(String(item && item.id));

        if (!menuItem) {
            throw new Error(`Menu item not found: ${(item && item.name) || (item && item.id) || 'unknown item'}`);
        }
        if (menuItem.status !== 'Available') {
            throw new Error(`${menuItem.name} is currently unavailable`);
        }

        const price = parsePrice(menuItem.price);
        if (price === null) {
            throw new Error(`Invalid price configured for ${menuItem.name}`);
        }

        // Never guess what the customer meant: a missing, fractional, zero or negative quantity is an error
        const quantity = item.quantity;
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ITEM_QUANTITY) {
            throw new Error(`Invalid quantity for ${menuItem.name}. Please choose between 1 and ${MAX_ITEM_QUANTITY}.`);
        }

        resolvedItems.push({
            id: menuItem._id.toString(),
            name: menuItem.name,
            price,
            quantity,
            category: menuItem.category,
            image: menuItem.image
        });

        totalAmount += price * quantity;
    }

    return { items: resolvedItems, totalAmount: Math.round(totalAmount * 100) / 100 };
}

module.exports = { resolveOrderItems, parsePrice };
