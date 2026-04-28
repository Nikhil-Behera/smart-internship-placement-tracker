const express = require("express");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/applications
// @desc    Get all applications for logged-in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(filter).sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/all
// @desc    Get all applications (Admin only)
// @access  Private/Admin
router.get("/all", protect, admin, async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate("user", "name email branch")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/stats
// @desc    Get application stats for dashboard
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { user: req.user._id };

    const total = await Application.countDocuments(filter);
    const applied = await Application.countDocuments({
      ...filter,
      status: "applied",
    });
    const shortlisted = await Application.countDocuments({
      ...filter,
      status: "shortlisted",
    });
    const interview = await Application.countDocuments({
      ...filter,
      status: "interview",
    });
    const placed = await Application.countDocuments({
      ...filter,
      status: "placed",
    });
    const rejected = await Application.countDocuments({
      ...filter,
      status: "rejected",
    });

    res.json({ total, applied, shortlisted, interview, placed, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/applications
// @desc    Create a new application
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      message: `Application submitted to ${application.company} for ${application.role}`,
      type: "status_update",
      relatedApplication: application._id,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update an application
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check ownership (unless admin)
    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const oldStatus = application.status;
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Create notification if status changed
    if (req.body.status && req.body.status !== oldStatus) {
      await Notification.create({
        user: application.user,
        message: `Your application at ${updatedApplication.company} status changed to "${updatedApplication.status}"`,
        type: "status_update",
        relatedApplication: updatedApplication._id,
      });
    }

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete an application
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Application.findByIdAndDelete(req.params.id);
    await Notification.deleteMany({ relatedApplication: req.params.id });
    res.json({ message: "Application removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
