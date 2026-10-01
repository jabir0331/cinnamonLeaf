// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Name, email, phone and password are required" });
    }

    const exitingUser = await User.findOne({ email });

    if (exitingUser) return res.status(400).json({ error: "An account with this email already exists" });

    const user = await User.create({ name, email, phone, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      token,
      user: { id: user._id, name, email, phone, role: user.role }
    });

  } 
  catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new Error('There is no user with such Email');

    if (!user.password) throw new Error('This account uses Google Sign-In. Please continue with Google.');

    const isMatch = await require('bcrypt').compare(password, user.password);

    if (!isMatch) throw new Error('Incorrect password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  }
  catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) return res.status(400).json({ error: "Missing Google credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload.email_verified) {
      return res.status(400).json({ error: "Google account email is not verified" });
    }

    let user = await User.findOne({ email: payload.email });

    if (user) {
      if (!user.googleId) {
        user.googleId = payload.sub;
        await user.save();
      }
    } else {
      user = await User.create({
        name: payload.name || payload.email,
        email: payload.email,
        googleId: payload.sub,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message || "Google sign-in failed" });
  }
};

exports.logout = (req, res) => {
  // Optionally: invalidate token in DB/Redis if implementing blacklisting
  return res.json({ message: 'Logged out successfully' });
};