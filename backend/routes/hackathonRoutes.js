const express = require("express");

const {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  joinHackathon,
  getMyHackathons,
} = require("../controllers/hackathonController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", protect, createHackathon);

router.get("/", getHackathons);

router.get("/mine", protect, getMyHackathons);

router.get("/:id", getHackathonById);

router.put("/:id", protect, updateHackathon);

router.delete("/:id", protect, deleteHackathon);

router.post("/:id/join", protect, joinHackathon);
module.exports = router;