const { getDB } = require("../db");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

const savePayment = async (req, res) => {
  const db = getDB();
  const paymentData = req.body;

  try {
    await db.collection("payments").insertOne({
      ...paymentData,
      paidAt: new Date(),
    });

    res.status(201).json({ message: "Payment saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save payment" });
  }
};

const validateCoupon = async (req, res) => {
  const db = getDB();
  const { code } = req.params;

  const coupon = await db.collection("coupons").findOne({ code, isActive: true });

  if (!coupon) {
    return res.status(404).json({ error: "Invalid or expired coupon" });
  }

  res.json(coupon);
};

module.exports = { createPaymentIntent, savePayment, validateCoupon };
