const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hackathon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hackathon",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent a user from submitting more than one join request for the same hackathon.
joinRequestSchema.index({ user: 1, hackathon: 1 }, { unique: true });

module.exports = mongoose.model("JoinRequest", joinRequestSchema);