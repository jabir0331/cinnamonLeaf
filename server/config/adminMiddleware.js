// server/config/adminMiddleware.js
// Must run after authMiddleware, which sets req.user.
module.exports = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
