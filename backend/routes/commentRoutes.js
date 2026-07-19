const express = require("express");
const { createComment, getComments } = require("../controllers/CommentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId", protect, createComment);
router.get("/:projectId", getComments);

module.exports = router;