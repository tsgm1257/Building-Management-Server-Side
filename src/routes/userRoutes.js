const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const { saveUser, getUserRole } = require("../controllers/userController");

router.put("/", verifyToken, saveUser);

router.get("/role", verifyToken, getUserRole);

module.exports = router;
