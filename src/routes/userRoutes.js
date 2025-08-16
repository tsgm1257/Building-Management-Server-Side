const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  saveUser,
  getUserRole,
  getMe,
} = require("../controllers/userController");

// Upsert auth user (name, photoURL, phone, address)
router.put("/", verifyToken, saveUser);

// Current user's role
router.get("/role", verifyToken, getUserRole);

// Current user's profile
router.get("/me", verifyToken, getMe);

module.exports = router;
