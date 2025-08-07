const { getDB } = require("../db");

const makeAnnouncement = async (req, res) => {
  const db = getDB();
  const { title, description } = req.body;

  try {
    await db.collection("announcements").insertOne({
      title,
      description,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Announcement created" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

const getAnnouncements = async (req, res) => {
  const db = getDB();

  try {
    const announcements = await db
      .collection("announcements")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

module.exports = { makeAnnouncement, getAnnouncements };
