const Post = require("../models/Post");
const Comment = require("../models/Comment");

// POST /posts  (multipart/form-data: content + up to 4 "images" files)
const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // With Cloudinary, req.files[i].path is already a complete, permanent
    // HTTPS URL — no path-building needed, unlike the old local-disk setup.
    const images = (req.files || []).map((file) => file.path);

    const post = await Post.create({
      content: content.trim(),
      author: req.user._id,
      images,
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

    // Attach a comment count per post so the feed can show it without
    // fetching every post's full comment thread up front.
    const counts = await Comment.aggregate([
      { $match: { post: { $in: posts.map((p) => p._id) } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

    const postsWithCounts = posts.map((p) => ({
      ...p.toObject(),
      commentsCount: countMap[p._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts: postsWithCounts,
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
    await Comment.deleteMany({ post: post._id });

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

// POST /posts/:id/bookmark
const toggleBookmarkPost = async (req, res) => {
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

    const alreadyBookmarked = post.bookmarks.some((bId) => bId.toString() === userId.toString());

    if (alreadyBookmarked) {
      post.bookmarks = post.bookmarks.filter((bId) => bId.toString() !== userId.toString());
    } else {
      post.bookmarks.push(userId);
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: alreadyBookmarked ? "Bookmark removed" : "Post bookmarked",
      bookmarked: !alreadyBookmarked,
      bookmarksCount: post.bookmarks.length,
    });
  } catch (error) {
    console.error("toggleBookmarkPost error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the bookmark",
    });
  }
};

// GET /posts/:id/comments
const getPostComments = async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ post: id })
      .populate("user", "username name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
    });
  } catch (error) {
    console.error("getPostComments error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching comments",
    });
  }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username name avatar");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        return res.status(200).json({
            success: true,
            post,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// POST /posts/:id/comments
const createPostComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = await Comment.create({
      post: id,
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
    console.error("createPostComment error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding the comment",
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getPostComments,
  createPostComment,
  getPostById,
};