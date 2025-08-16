const { getDB } = require("../db");
const { ObjectId } = require("mongodb");

// GET /api/apartments
// supports: ?minRent=...&maxRent=...&page=1&limit=6&sort=price_asc|price_desc
const getApartments = async (req, res) => {
  try {
    const db = getDB();

    const pageNum = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limitNum = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 6)
    );

    const min =
      req.query.minRent !== undefined
        ? parseInt(req.query.minRent, 10)
        : undefined;
    const max =
      req.query.maxRent !== undefined
        ? parseInt(req.query.maxRent, 10)
        : undefined;

    const query = {};
    if (Number.isFinite(min) || Number.isFinite(max)) {
      query.rent = {};
      if (Number.isFinite(min)) query.rent.$gte = min;
      if (Number.isFinite(max)) query.rent.$lte = max;
    }

    let sortSpec = { _id: -1 };
    if (req.query.sort === "price_asc") sortSpec = { rent: 1, _id: -1 };
    if (req.query.sort === "price_desc") sortSpec = { rent: -1, _id: -1 };

    const coll = db.collection("apartments");

    const [apartments, total] = await Promise.all([
      coll
        .find(query)
        .sort(sortSpec)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .toArray(),
      coll.countDocuments(query),
    ]);

    res.json({
      apartments,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    });
  } catch (error) {
    console.error("getApartments error:", error);
    res.status(500).json({ error: "Failed to fetch apartments" });
  }
};

// GET /api/apartments/:id
const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid apartment id" });
    }

    const db = getDB();
    const apt = await db
      .collection("apartments")
      .findOne({ _id: new ObjectId(id) });
    if (!apt) return res.status(404).json({ error: "Apartment not found" });

    res.json(apt);
  } catch (error) {
    console.error("getApartmentById error:", error);
    res.status(500).json({ error: "Failed to fetch apartment" });
  }
};

// POST /api/apartments/seed  (optional: real-looking sample data)
const seedApartments = async (req, res) => {
  try {
    const db = getDB();
    const sample = [
      {
        image:
          "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80&auto=format&fit=crop",
        floor: 1,
        block: "A",
        number: "101",
        rent: 1500,
      },
      {
        image:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80&auto=format&fit=crop",
        floor: 2,
        block: "A",
        number: "102",
        rent: 1800,
      },
      {
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop",
        floor: 3,
        block: "B",
        number: "301",
        rent: 2200,
      },
    ];

    await db.collection("apartments").insertMany(sample);
    res.json({ message: "Sample apartments inserted", count: sample.length });
  } catch (error) {
    console.error("seedApartments error:", error);
    res.status(500).json({ error: "Failed to seed apartments" });
  }
};

module.exports = { getApartments, getApartmentById, seedApartments };
