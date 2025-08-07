const { getDB } = require("../db");

const getMembers = async (req, res) => {
  const db = getDB();
  const members = await db
    .collection("users")
    .find({ role: "member" })
    .toArray();
  res.json(members);
};

const demoteMember = async (req, res) => {
  const { email } = req.params;
  const db = getDB();

  try {
    // Start a transaction-like operation
    console.log(`Demoting member: ${email}`);

    // Step 1: Update user role from "member" to "user"
    const userUpdateResult = await db
      .collection("users")
      .updateOne({ email }, { $set: { role: "user", updatedAt: new Date() } });

    if (userUpdateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Step 2: Remove/delete the agreement for this user
    const agreementDeleteResult = await db.collection("agreements").deleteOne({
      userEmail: email,
      status: "checked", // Only remove accepted agreements
    });

    console.log(`Agreement deletion result:`, agreementDeleteResult);

    // Alternative: If you want to keep the agreement but mark it as inactive
    // const agreementUpdateResult = await db.collection("agreements").updateOne(
    //   { userEmail: email, status: "checked" },
    //   { $set: { status: "removed", removedAt: new Date() } }
    // );

    res.json({
      message: "Member demoted to user and agreement removed successfully",
      userUpdated: userUpdateResult.modifiedCount > 0,
      agreementRemoved: agreementDeleteResult.deletedCount > 0,
    });
  } catch (err) {
    console.error("Error demoting member:", err);
    res.status(500).json({ error: "Failed to demote member: " + err.message });
  }
};

module.exports = { getMembers, demoteMember };
