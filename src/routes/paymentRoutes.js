const express = require("express");
const router = express.Router();
const { getDB } = require("../db"); // Add this import
const verifyToken = require("../middlewares/verifyToken");
const {
  createPaymentIntent,
  savePayment,
  validateCoupon,
} = require("../controllers/paymentController");

router.post("/create-payment-intent", verifyToken, createPaymentIntent);

router.post("/", verifyToken, savePayment);

router.get("/coupon/:code", verifyToken, validateCoupon);

router.get("/user", verifyToken, async (req, res) => {
  const { email } = req.query;
  const db = getDB();

  try {
    const payments = await db
      .collection("payments")
      .find({ userEmail: email })
      .sort({ paidAt: -1 })
      .toArray();

    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;
