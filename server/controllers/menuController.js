// server/controllers/menuController.js
const MenuItem = require("../models/MenuItems");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    console.log('Fetching all menu items from database...');
    console.log('Database name:', MenuItem.db.name);
    console.log('Collection name:', MenuItem.collection.collectionName);
    
    // Try to count documents first
    const count = await MenuItem.countDocuments();
    console.log('Total documents in collection:', count);
    
    const menuItems = await MenuItem.find();
    console.log('Found', menuItems.length, 'menu items');
    
    // Log the first few items if they exist
    if (menuItems.length > 0) {
      console.log('Sample items:', menuItems.slice(0, 3));
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Menu items fetched successfully',
      menuItems: menuItems 
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch menu items",
      error: error.message 
    });
  }
};