const express = require("express");
const router = express.Router();
const {
  getApartments,
  seedApartments,
} = require("../controllers/apartmentController");

// Get apartments
router.get("/", getApartments);

router.post("/seed", seedApartments);

module.exports = router;
