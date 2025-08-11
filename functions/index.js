const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Models & Routes
const Order = require("./models/Order"); // ✅ Make sure this path is correct
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json()); // ✅ Parse JSON bodies

// MongoDB connection (use your connection string from .env)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Cravory Backend Running via Firebase Functions 🚀");
});

// Export API to Firebase
exports.api = functions.https.onRequest(app);
