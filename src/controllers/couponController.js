const { getDB } = require("../db");

const getCoupons = async (req, res) => {
  try {
    const db = getDB();
    const coupons = await db.collection("coupons").find().toArray();
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching coupons:", err);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};

const getActiveCoupons = async (req, res) => {
  try {
    const db = getDB();
    const coupons = await db
      .collection("coupons")
      .find({ isActive: true })
      .toArray();
    res.json(coupons);
  } catch (err) {
    console.error("Error fetching active coupons:", err);
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
};

const addCoupon = async (req, res) => {
  try {
    const db = getDB();
    const { code, discountPercentage, description } = req.body;

    const exists = await db.collection("coupons").findOne({ code });
    if (exists) return res.status(400).json({ error: "Coupon already exists" });

    await db.collection("coupons").insertOne({
      code,
      discountPercentage,
      description,
      isActive: true,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Coupon created" });
  } catch (err) {
    console.error("Error adding coupon:", err);
    res.status(500).json({ error: "Failed to add coupon" });
  }
};

const toggleCoupon = async (req, res) => {
  try {
    const db = getDB();
    const { code } = req.params;

    const coupon = await db.collection("coupons").findOne({ code });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });

    await db
      .collection("coupons")
      .updateOne({ code }, { $set: { isActive: !coupon.isActive } });

    res.json({ message: "Coupon status updated" });
  } catch (err) {
    console.error("Error toggling coupon:", err);
    res.status(500).json({ error: "Failed to update coupon" });
  }
};

module.exports = { getCoupons, getActiveCoupons, addCoupon, toggleCoupon };
