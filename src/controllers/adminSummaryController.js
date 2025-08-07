const { getDB } = require("../db");

const getAdminSummary = async (req, res) => {
  const db = getDB();

  try {
    const totalRooms = await db.collection("apartments").countDocuments();

    const agreementCount = await db.collection("agreements").countDocuments({
      status: "checked",
    });

    const availableRooms = totalRooms - agreementCount;
    const availablePercentage = ((availableRooms / totalRooms) * 100).toFixed(1);
    const rentedPercentage = ((agreementCount / totalRooms) * 100).toFixed(1);

    const totalUsers = await db.collection("users").countDocuments({ role: "user" });
    const totalMembers = await db.collection("users").countDocuments({ role: "member" });

    res.json({
      totalRooms,
      availablePercentage,
      rentedPercentage,
      totalUsers,
      totalMembers,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load admin summary" });
  }
};

module.exports = { getAdminSummary };
