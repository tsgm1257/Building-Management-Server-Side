const express = require("express");
const router = express.Router();
const {
  getCoupons,
  getActiveCoupons,
  addCoupon,
  toggleCoupon,
} = require("../controllers/couponController");

// Get all coupons
router.get("/", getCoupons);

// Get active coupons only
router.get("/active", getActiveCoupons);

// Add new coupon
router.post("/", addCoupon);

// Toggle coupon active status
router.put("/:code/toggle", toggleCoupon);

module.exports = router;
