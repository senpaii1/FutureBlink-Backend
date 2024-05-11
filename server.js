require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
//Middleware
app.use(bodyParser.json());
app.use(cors());

//Routes
const emailSequence = require("./routes/emailSequence");
const authRoutes = require("./routes/auth");
//Define your routes here
app.use("/api/emailSequence", emailSequence);
app.use("/api/auth", authRoutes);
//Schema

//start Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server after successful DB connection

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
