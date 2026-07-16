const Comment = require("../models/Comment");
const Project = require("../models/Project");

// POST /comments/:projectId
const createComment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const comment = await Comment.create({
      project: projectId,
      user: req.user._id,
      text: text.trim(),
    });

    const populatedComment = await comment.populate("user", "username name avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error("createComment error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding the comment",
    });
  }
};

// GET /comments/:projectId
const getComments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({ project: projectId })
      .populate("user", "username name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("getComments error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching comments",
    });
  }
};

module.exports = { createComment, getComments };