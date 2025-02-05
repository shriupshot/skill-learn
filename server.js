const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Allow frontend requests
  methods: ["POST"]
}));

// MongoDB Connection
mongoose.connect("mongodb+srv://Surendar:sura1234@cluster0.3kgm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Stop execution if connection fails
  });

// Define Schema and Model
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
});
const Email = mongoose.model("Email", emailSchema);

// API Route to Save Email
app.post("/api/certification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if email already exists
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already submitted!" });
    }

    const newEmail = new Email({ email });
    await newEmail.save();

    res.status(201).json({ message: "Email stored successfully!" });
  } catch (error) {
    console.error("❌ Error storing email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
