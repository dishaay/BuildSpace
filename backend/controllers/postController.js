const Post = require("../models/Post");

// POST /posts
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    const post = await Post.create({
      content: content.trim(),
      author: req.user._id,
    });

    const populatedPost = await post.populate("author", "username name avatar");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("createPost error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while creating the post",
    });
  }
};

// GET /posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("getPosts error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching posts",
    });
  }
};

// DELETE /posts/:id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("deletePost error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the post",
    });
  }
};

// POST /posts/:id/like
const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some((likeId) => likeId.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((likeId) => likeId.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Post liked",
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("toggleLikePost error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the like",
    });
  }
};

module.exports = { createPost, getPosts, deletePost, toggleLikePost };