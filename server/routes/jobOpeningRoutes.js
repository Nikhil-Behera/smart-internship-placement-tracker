const express = require("express");
const JobOpening = require("../models/JobOpening");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/job-openings
// @desc    Get all job openings
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const jobOpenings = await JobOpening.find({})
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(jobOpenings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/job-openings
// @desc    Create a new job opening (admin)
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const jobOpening = await JobOpening.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json(jobOpening);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
