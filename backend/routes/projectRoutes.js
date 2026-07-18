const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleBookmark,
  getProjectLikes,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// upload.fields lets one multipart request carry both a single thumbnail
// and multiple screenshots at once, each under their own field name.
const projectImageFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "screenshots", maxCount: 6 },
]);

router.post("/", protect, projectImageFields, createProject);

router.get("/", getProjects);

router.get("/:id", getProjectById);

router.post("/:id/like", protect, toggleLike);
router.get("/:id/likes", getProjectLikes);

router.post("/:id/bookmark", protect, toggleBookmark);

router.put("/:id", protect, projectImageFields, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;