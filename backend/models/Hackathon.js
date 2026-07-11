const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    officialLink: {
      type: String,
      required: true,
    },

    registrationDeadline: {
      type: Date,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    techStack: {
      type: [String],
      default: [],
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
    },

    location: {
      type: String,
    },

    prizePool: {
      type: String,
    },

    maxTeamSize: {
      type: Number,
      required: true,
    },

    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },

    status: {
      type: String,
      enum: ["Open", "Full", "Closed"],
      default: "Open",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hackathon", hackathonSchema);