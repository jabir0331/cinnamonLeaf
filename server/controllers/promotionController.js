const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Promotion = require("../models/Promotion");

const UPLOADS_DIR = path.join(__dirname, '../uploads/promotions');

const slugify = (name) =>
    name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

// Configure storage for promotion images
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
        const baseName = slugify(req.body.title || 'promotion');
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

// Create a new promotion
exports.createPromotion = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { title, description, badgeText, validUntil } = req.body;

            if (!title || !description) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(400).json({
                    success: false,
                    message: "Title and description are required"
                });
            }

            const newPromotion = new Promotion({
                title,
                description,
                badgeText: badgeText || undefined,
                validUntil: validUntil || undefined,
                image: req.file ? `/uploads/promotions/${req.file.filename}` : undefined
            });

            const savedPromotion = await newPromotion.save();

            res.status(201).json({
                success: true,
                message: 'Promotion created successfully',
                promotion: savedPromotion
            });
        } catch (error) {
            console.error("Error creating promotion:", error);
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).json({
                success: false,
                message: "Failed to create promotion",
                error: error.message
            });
        }
    }
];

// Get all promotions
exports.getAllPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Promotions fetched successfully',
            promotions
        });
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch promotions",
            error: error.message
        });
    }
};

exports.updatePromotion = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, badgeText, validUntil } = req.body;

            const existingPromotion = await Promotion.findById(id);
            if (!existingPromotion) {
                if (req.file) fs.unlinkSync(req.file.path);
                return res.status(404).json({
                    success: false,
                    message: "Promotion not found"
                });
            }

            let imagePath = existingPromotion.image;

            if (req.file) {
                if (existingPromotion.image) {
                    const oldImagePath = path.join(__dirname, '..', existingPromotion.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                imagePath = `/uploads/promotions/${req.file.filename}`;
            }

            const updatedData = {
                title: title || existingPromotion.title,
                description: description || existingPromotion.description,
                badgeText: badgeText || undefined,
                validUntil: validUntil || undefined,
                image: imagePath
            };

            const updatedPromotion = await Promotion.findByIdAndUpdate(
                id,
                updatedData,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Promotion updated successfully',
                promotion: updatedPromotion
            });
        } catch (error) {
            console.error("Error updating promotion:", error);
            if (req.file) fs.unlinkSync(req.file.path);
            res.status(500).json({
                success: false,
                message: "Failed to update promotion",
                error: error.message
            });
        }
    }
];

exports.togglePromotionStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const promotion = await Promotion.findById(id);
        if (!promotion) {
            return res.status(404).json({
                success: false,
                message: "Promotion not found"
            });
        }

        promotion.isActive = !promotion.isActive;
        await promotion.save();

        res.status(200).json({
            success: true,
            message: `Promotion ${promotion.isActive ? 'enabled' : 'disabled'} successfully`,
            promotion
        });
    } catch (error) {
        console.error("Error toggling promotion status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to toggle promotion status",
            error: error.message
        });
    }
};
