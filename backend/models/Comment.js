const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    // Exactly one of these two will be set, depending on what the comment
    // is on — a project or a post. Both are optional at the schema level;
    // the controllers are responsible for setting the right one.
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);