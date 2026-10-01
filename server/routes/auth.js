// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { signup, login, logout, googleAuth } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);

module.exports = router;
