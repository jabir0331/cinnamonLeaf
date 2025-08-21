// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body; 

    const exitingUser = await User.findOne({ email });

    if (exitingUser) return res.status(400).json({ error: "An account with this email already exists" });
    
    const user = await User.create({ name, email, phone, password }); 

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      token, 
      user: { id: user._id, name, email, phone } 
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

    const isMatch = await require('bcrypt').compare(password, user.password);

    if (!isMatch) throw new Error('Incorrect password');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } 
  catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.logout = (req, res) => {
  // Optionally: invalidate token in DB/Redis if implementing blacklisting
  return res.json({ message: 'Logged out successfully' });
};