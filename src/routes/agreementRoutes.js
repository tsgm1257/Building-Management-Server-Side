const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  requestAgreement,
  getUserAgreement,
  updateAgreementStatus,
} = require("../controllers/agreementController");

router.post("/", verifyToken, requestAgreement);

router.get("/user", verifyToken, (req, res) => {
  getUserAgreement(req, res);
});

router.patch("/:id", verifyToken, updateAgreementStatus);

module.exports = router;
