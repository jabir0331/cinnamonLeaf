const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MenuItem = require("../models/MenuItems");

// Configure storage for menu item images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category.toLowerCase().replace(/\s+/g, '_');
    const uploadPath = `../client/public/images/menu/${category}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename using the item name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = req.body.name.replace(/\s+/g, '_').toLowerCase();
    cb(null, baseName + '-' + uniqueSuffix + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Create a new menu item
exports.createMenuItem = [
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        name,
        description,
        category,
        price,
        spicy = false,
        vegetarian = false,
        popular = false
      } = req.body;

      // Validate required fields
      if (!name || !description || !category || !price || !req.file) {
        // If validation fails, delete the uploaded file
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided"
        });
      }

      // Generate relative path for the image (from client public folder)
      const imagePath = `/images/menu/${category.toLowerCase().replace(/\s+/g, '_')}/${req.file.filename}`;

      const newMenuItem = new MenuItem({
        name,
        description,
        category,
        price: `LKR ${parseFloat(price).toFixed(2)}`,
        image: imagePath,
        spicy: spicy === 'true',
        vegetarian: vegetarian === 'true',
        popular: popular === 'true',
        status: 'Available'
      });

      const savedMenuItem = await newMenuItem.save();

      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        menuItem: savedMenuItem
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
      // If there's an error, delete the uploaded file
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: "Failed to create menu item",
        error: error.message
      });
    }
  }
];

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    console.log('Fetching all menu items from database...');

    // Sort by creation date ascending
    const menuItems = await MenuItem.find().sort({ name: 1 });
    console.log('Found', menuItems.length, 'menu items');

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


exports.updateMenuItem = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        category,
        price,
        spicy = false,
        vegetarian = false,
        popular = false
      } = req.body;

      // Find existing menu item
      const existingItem = await MenuItem.findById(id);
      if (!existingItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found"
        });
      }

      let imagePath = existingItem.image;

      // If new image is uploaded
      if (req.file) {
        // Delete old image file
        const oldImagePath = path.join('../client/public', existingItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Generate new image path
        imagePath = `/images/menu/${category.toLowerCase().replace(/\s+/g, '_')}/${req.file.filename}`;
      }

      const updatedData = {
        name,
        description,
        category,
        price: price.startsWith('LKR') ? price : `LKR ${parseFloat(price).toFixed(2)}`,
        image: imagePath,
        spicy: spicy === 'true',
        vegetarian: vegetarian === 'true',
        popular: popular === 'true'
      };

      const updatedMenuItem = await MenuItem.findByIdAndUpdate(
        id,
        updatedData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        menuItem: updatedMenuItem
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      // If there's an error and new file was uploaded, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        message: "Failed to update menu item",
        error: error.message
      });
    }
  }
];

// In menuController.js, add this function
exports.toggleMenuItemStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    // Toggle status between Available and Unavailable
    const newStatus = menuItem.status === 'Available' ? 'Unavailable' : 'Available';

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Menu item ${newStatus === 'Available' ? 'enabled' : 'disabled'} successfully`,
      menuItem: updatedMenuItem
    });
  } catch (error) {
    console.error("Error toggling menu item status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle menu item status",
      error: error.message
    });
  }
};

