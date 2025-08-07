const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

const getAgreementRequests = async (req, res) => {
  try {
    const db = getDB();
    const requests = await db
      .collection("agreements")
      .find({ status: "pending" })
      .toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to load agreement requests" });
  }
};

const handleAgreement = async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const { action, userEmail } = req.body;

  try {
    // Mark request as checked
    await db.collection("agreements").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "checked" } }
    );

    // If accepted, update user role
    if (action === "accept") {
      await db.collection("users").updateOne(
        { email: userEmail },
        { $set: { role: "member" } }
      );
    }

    res.json({ message: "Agreement handled" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update agreement" });
  }
};

module.exports = {
  getAgreementRequests,
  handleAgreement,
};
