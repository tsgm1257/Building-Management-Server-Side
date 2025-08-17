const { getDB } = require("../db");

const saveUser = async (req, res) => {
  try {
    const db = getDB();
    const { name, email, photoURL } = req.body;

    console.log("Saving user:", { name, email, photoURL });

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }

    // Insert new user
    const result = await db.collection("users").insertOne({
      name,
      email,
      photoURL: photoURL || null,
      role: "user",
      createdAt: new Date(),
    });

    console.log("User created successfully:", result);

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
    });
  } catch (err) {
    console.error("Save user error:", err);
    res.status(500).json({ error: "Failed to save user: " + err.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const db = getDB();
    // Use the email from the verified token instead of query parameter
    const email = req.user.email;

    console.log("Fetching role for email:", email);

    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      console.log("User not found, returning default role");
      // If user not found, return default role instead of error
      return res.json({ role: "user" });
    }

    console.log("User found:", user);
    res.json({ role: user.role });
  } catch (err) {
    console.error("Role fetch error:", err);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

module.exports = { saveUser, getUserRole };
