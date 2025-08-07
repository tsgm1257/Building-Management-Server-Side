const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");
const {
  getAgreementRequests,
  handleAgreement,
} = require("../controllers/adminController");
const { makeAnnouncement, getAnnouncements } = require("../controllers/announcementController");
const { getMembers, demoteMember } = require("../controllers/memberController");
const {
  getCoupons,
  addCoupon,
  toggleCoupon,
} = require("../controllers/couponController");
const { getAdminSummary } = require("../controllers/adminSummaryController");

router.get("/agreements", verifyToken, requireRole("admin"), getAgreementRequests);
router.patch("/agreements/:id", verifyToken, requireRole("admin"), handleAgreement);
router.post("/announcements", verifyToken, requireRole("admin"), makeAnnouncement);
router.get("/announcements", verifyToken, getAnnouncements);
router.get("/members", verifyToken, requireRole("admin"), getMembers);
router.patch("/members/:email/demote", verifyToken, requireRole("admin"), demoteMember);
router.get("/coupons", verifyToken, requireRole("admin"), getCoupons);
router.post("/coupons", verifyToken, requireRole("admin"), addCoupon);
router.patch("/coupons/:code/toggle", verifyToken, requireRole("admin"), toggleCoupon);
router.get("/summary", verifyToken, requireRole("admin"), getAdminSummary);

module.exports = router;
