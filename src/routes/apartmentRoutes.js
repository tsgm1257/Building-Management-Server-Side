const express = require("express");
const router = express.Router();
const {
  getApartments,
  getApartmentById,
  seedApartments,
} = require("../controllers/apartmentController");

router.get("/", getApartments);
router.post("/seed", seedApartments);
router.get("/:id", getApartmentById);

module.exports = router;
