const { getDB } = require("../db");

const saveUser = async (req, res) => {
  try {
    const db = getDB();
    const { name, email, photoURL, phone, address } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const users = db.collection("users");
    const result = await users.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          email,
          photoURL: photoURL || null,
          phone: phone || "",
          address: address || "",
        },
        $setOnInsert: {
          role: "user",
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    res.json({
      message: "User saved",
      user: {
        name: result.value.name,
        email: result.value.email,
        photoURL: result.value.photoURL || "",
        phone: result.value.phone || "",
        address: result.value.address || "",
        role: result.value.role || "user",
      },
    });
  } catch (err) {
    console.error("Save user error:", err);
    res.status(500).json({ error: "Failed to save user" });
  }
};

const getUserRole = async (req, res) => {
  try {
    const db = getDB();
    const email = req.userEmail; // set by verifyToken
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.json({ role: "user" });
    }
    res.json({ role: user.role || "user" });
  } catch (err) {
    console.error("Role fetch error:", err);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

const getMe = async (req, res) => {
  try {
    const db = getDB();
    const email = req.userEmail;
    if (!email) return res.status(401).json({ error: "Unauthorized" });

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.json({
        name: req.userName || "",
        email,
        photoURL: "",
        phone: "",
        address: "",
        role: "user",
      });
    }

    res.json({
      name: user.name || "",
      email: user.email,
      photoURL: user.photoURL || "",
      phone: user.phone || "",
      address: user.address || "",
      role: user.role || "user",
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

module.exports = { saveUser, getUserRole, getMe };
