const express = require("express");
const router = express.Router();
const EmailSequence = require("../models/emailSequence");
const auth = require("../middlewares/authorization");
// Create a new email sequence
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { nodes, edges, viewport } = req.body;
    const emailSequence = new EmailSequence({
      user: req.user._id, // Associate the email sequence with the authenticated user
      nodes,
      edges,
      viewport,
    });
    const savedEmailSequence = await emailSequence.save();
    res.json(savedEmailSequence);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all email sequences for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const emailSequences = await EmailSequence.find({ user: req.user._id });
    res.json(emailSequences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific email sequence
router.get("/:id", auth, getEmailSequence, (req, res) => {
  res.json(res.emailSequence);
});

// Update an email sequence
router.patch("/:id", auth, getEmailSequence, async (req, res) => {
  if (req.user._id.toString() !== res.emailSequence.user.toString()) {
    return res.status(403).json({
      message: "You are not authorized to update this email sequence.",
    });
  }
  // Update logic here
});

// Delete an email sequence
router.delete("/:id", auth, getEmailSequence, async (req, res) => {
  if (req.user._id.toString() !== res.emailSequence.user.toString()) {
    return res.status(403).json({
      message: "You are not authorized to delete this email sequence.",
    });
  }
  // Delete logic here
});

// Middleware function to get a specific email sequence by ID
async function getEmailSequence(req, res, next) {
  let emailSequence;
  try {
    emailSequence = await EmailSequence.findById(req.params.id);
    if (emailSequence == null) {
      return res.status(404).json({ message: "Email sequence not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.emailSequence = emailSequence;
  next();
}

module.exports = router;
