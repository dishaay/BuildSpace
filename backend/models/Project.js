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
    },
    liveLink: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    journey: {
    type: String,
    default: ""
},

inspiration: {
    type: String,
    default: ""
},

challenges: {
    type: String,
    default: ""
},

futurePlans: {
    type: String,
    default: ""
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
    githubLink: {
    type: String,
    default: ""
},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    bookmarks: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);