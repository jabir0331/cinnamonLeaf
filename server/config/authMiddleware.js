// server/config/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // fetch user, exclude password
    if(user) console.log({userData: user});
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; //full user information 
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is invalid" });
  }
};
