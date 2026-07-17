const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleBookmark,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const { getProjectLikes } = require("../controllers/projectController");

const router = express.Router();

router.post("/", protect, createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post("/:id/like", protect, toggleLike);
router.get("/:id/likes", getProjectLikes);

router.post("/:id/bookmark", protect, toggleBookmark);

router.put("/:id", protect, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;