// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const recipesRouter = require("./routes/recipes");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/recipesdb";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error", err);
    // Prevent crashing Jest tests
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
  });

// Routes
app.get("/", (req, res) => res.send("Recipe API is running"));
app.use("/api/recipes", recipesRouter);

// 404
app.use((req, res) => res.status(404).json({ message: "Not Found" }));

// Export app for testing
module.exports = app;

// Only start server if not running tests
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}
