const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const router = express.Router();

// User registration route
router.post("/register", async (req, res) => {
  try {
    // Extract user registration data from request body, including the role
    const { username, email, password, roles } = req.body;

    // Check if the username or email already exists in the database
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the provided role(s)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      roles, // Assign the provided role(s) to the new user
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
      },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    // Send the token back to the client
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    // Extract login credentials from request body
    const { username, password } = req.body;

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
