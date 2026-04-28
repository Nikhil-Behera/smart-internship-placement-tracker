const mongoose = require("mongoose");

const jobOpeningSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a job title"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["internship", "placement"],
      default: "placement",
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    applyLink: {
      type: String,
      default: "",
      trim: true,
    },
    deadline: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("JobOpening", jobOpeningSchema);
