const { getDB } = require("../db");

// GET /api/apartments
const getApartments = async (req, res) => {
  try {
    const db = getDB();
    const { minRent, maxRent, page = 1, limit = 6 } = req.query;

    const query = {};
    if (minRent && maxRent) {
      query.rent = {
        $gte: parseInt(minRent),
        $lte: parseInt(maxRent),
      };
    }

    const apartments = await db
      .collection("apartments")
      .find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray();

    const total = await db.collection("apartments").countDocuments(query);

    res.json({ apartments, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
};

// POST /api/apartments/seed
const seedApartments = async (req, res) => {
  try {
    const db = getDB();
    const sampleApartments = [
      {
        image: "image_url_1",
        floor: 1,
        block: "A",
        number: "101",
        rent: 1500,
      },
      {
        image: "image_url_2",
        floor: 2,
        block: "A",
        number: "102",
        rent: 1800,
      },
      // Add more as needed
    ];

    await db.collection("apartments").insertMany(sampleApartments);
    res.json({ message: "Sample apartments inserted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to seed apartments" });
  }
};

module.exports = { getApartments, seedApartments };
