const express = require("express");
const { createPost, getPosts, deletePost, toggleLikePost } = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getPosts);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLikePost);

module.exports = router;