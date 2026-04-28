const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Please provide the role/position"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["internship", "placement"],
      default: "internship",
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interview", "placed", "rejected"],
      default: "applied",
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    stipend: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    interviewDate: {
      type: Date,
    },
    offerLetterLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
