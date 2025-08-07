const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./db");

const userRoutes = require("./routes/userRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");
const agreementRoutes = require("./routes/agreementRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const couponRoutes = require("./routes/couponRoutes");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Building Management API is running");
});

app.use("/api/users", userRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/coupons", couponRoutes);

// Start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
