// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../config/authMiddleware');
const { signup, login, logout, googleAuth, getMe } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.get('/me', authMiddleware, getMe);
router.post('/logout', logout);

module.exports = router;
