const { getDB } = require("../db");

const requireRole = (requiredRole) => {
  return async (req, res, next) => {
    const db = getDB();
    const email = req.user.email;

    try {
      const user = await db.collection("users").findOne({ email });

      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden - Insufficient role" });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: "Server error checking role" });
    }
  };
};

module.exports = requireRole;
