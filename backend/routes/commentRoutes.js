const express = require("express");
const { createComment, getComments } = require("../controllers/commentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId", protect, createComment);
router.get("/:projectId", getComments);

module.exports = router;