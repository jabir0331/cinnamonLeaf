const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Category = require("../models/Category");

const UPLOADS_DIR = path.join(__dirname, '../uploads/categories');

const slugify = (name) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// Configure storage for category images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const baseName = slugify(req.body.name || 'category');
        cb(null, baseName + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Create a new category
exports.createCategory = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: "Name and description are required"
                });
            }

            const slug = slugify(name);

            const existing = await Category.findOne({ $or: [{ name }, { slug }] });
            if (existing) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: "A category with this name already exists"
                });
            }

            const newCategory = new Category({
                name,
                slug,
                description,
                image: req.file ? `/uploads/categories/${req.file.filename}` : undefined
            });

            const savedCategory = await newCategory.save();

            res.status(201).json({
                success: true,
                message: 'Category created successfully',
                category: savedCategory
            });
        } catch (error) {
            console.error("Error creating category:", error);
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).json({
                success: false,
                message: "Failed to create category",
                error: error.message
            });
        }
    }
];

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            categories
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};

exports.updateCategory = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const existingCategory = await Category.findById(id);
            if (!existingCategory) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            let imagePath = existingCategory.image;

            if (req.file) {
                if (existingCategory.image) {
                    const oldImagePath = path.join(__dirname, '..', existingCategory.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                imagePath = `/uploads/categories/${req.file.filename}`;
            }

            const updatedData = {
                name: name || existingCategory.name,
                description: description || existingCategory.description,
                image: imagePath
            };

            const updatedCategory = await Category.findByIdAndUpdate(
                id,
                updatedData,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                category: updatedCategory
            });
        } catch (error) {
            console.error("Error updating category:", error);
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).json({
                success: false,
                message: "Failed to update category",
                error: error.message
            });
        }
    }
];

exports.toggleCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        category.isActive = !category.isActive;
        await category.save();

        res.status(200).json({
            success: true,
            message: `Category ${category.isActive ? 'enabled' : 'disabled'} successfully`,
            category
        });
    } catch (error) {
        console.error("Error toggling category status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to toggle category status",
            error: error.message
        });
    }
};
