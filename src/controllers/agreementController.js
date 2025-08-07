const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

const requestAgreement = async (req, res) => {
  try {
    const db = getDB();
    const {
      userName,
      userEmail,
      floor,
      block,
      number,
      rent,
      status = "pending",
    } = req.body;

    const exists = await db.collection("agreements").findOne({ userEmail });
    if (exists) {
      return res
        .status(400)
        .json({ error: "You have already requested an agreement." });
    }

    const result = await db.collection("agreements").insertOne({
      userName,
      userEmail,
      floor,
      block,
      number,
      rent,
      status,
      requestDate: new Date(),
    });

    res.status(201).json({
      message: "Agreement request saved",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save agreement request" });
  }
};

const getUserAgreement = async (req, res) => {
  try {
    const db = getDB();
    const { email } = req.query;

    const userEmail = email || req.user?.email;

    if (!userEmail) {
      return res.status(400).json({ error: "Email is required" });
    }

    const allAgreements = await db
      .collection("agreements")
      .find({ userEmail })
      .toArray();

    const agreement = await db.collection("agreements").findOne({
      userEmail,
      status: "checked",
    });

    if (!agreement) {
      return res.status(404).json({ error: "No accepted agreement found" });
    }

    res.json(agreement);
  } catch (error) {
    console.error("Error fetching user agreement:", error);
    res.status(500).json({ error: "Failed to fetch agreement" });
  }
};

// Updated function to handle agreement status updates according to requirements
const updateAgreementStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { action, userEmail } = req.body;

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    // IMPORTANT: Always set status to "checked" for both accept and reject
    const agreementUpdate = {
      status: "checked",
      updatedAt: new Date(),
    };

    // Only add acceptedAt when accepting
    if (action === "accept") {
      agreementUpdate.acceptedAt = new Date();
    }

    // Update the agreement - status is ALWAYS "checked"
    const result = await db
      .collection("agreements")
      .updateOne({ _id: new ObjectId(id) }, { $set: agreementUpdate });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    // Update user role: "member" if accepted, "user" if rejected
    if (userEmail) {
      const newRole = action === "accept" ? "member" : "user";

      await db.collection("users").updateOne(
        { email: userEmail },
        {
          $set: {
            role: newRole,
            updatedAt: new Date(),
          },
        }
      );
    }

    res.json({
      message: `Agreement ${action}ed successfully`,
      status: "checked", // Always return "checked"
      userRole: action === "accept" ? "member" : "user",
    });
  } catch (error) {
    console.error("Error updating agreement status:", error);
    res.status(500).json({ error: "Failed to update agreement status" });
  }
};

module.exports = { requestAgreement, getUserAgreement, updateAgreementStatus };
