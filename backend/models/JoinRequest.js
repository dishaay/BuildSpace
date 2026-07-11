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
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true }
);

// One user can send only one request per hackathon
joinRequestSchema.index(
  { user: 1, hackathon: 1 },
  { unique: true }
);

module.exports = mongoose.model("JoinRequest", joinRequestSchema);