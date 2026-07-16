const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
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

    techStack: {
      type: [String],
      default: [],
    },

    githubLink: {
      type: String,
      default: "",
    },

    liveLink: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    inspiration: {
      type: String,
      default: "",
    },

    journey: {
      type: String,
      default: "",
    },

    challenges: {
      type: String,
      default: "",
    },

    futurePlans: {
      type: String,
      default: "",
    },

    screenshots: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Project",
  projectSchema
);