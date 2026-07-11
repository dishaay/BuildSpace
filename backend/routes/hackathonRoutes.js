const express = require("express");

const {
  createHackathon,
  getHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
} = require("../controllers/hackathonController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createHackathon);

router.get("/", getHackathons);

router.get("/:id", getHackathonById);

router.put("/:id", protect, updateHackathon);

router.delete("/:id", protect, deleteHackathon);

module.exports = router;