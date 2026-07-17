const express = require("express");
const {
  createPost,
  getPosts,
  deletePost,
  toggleLikePost,
  toggleBookmarkPost,
  getPostComments,
  createPostComment,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { getPostById } = require("../controllers/postController");
const router = express.Router();

router.post("/", protect, upload.array("images", 4), createPost);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLikePost);
router.post("/:id/bookmark", protect, toggleBookmarkPost);
router.get("/:id/comments", getPostComments);
router.post("/:id/comments", protect, createPostComment);

module.exports = router;