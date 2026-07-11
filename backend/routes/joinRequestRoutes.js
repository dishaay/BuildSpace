const express = require("express");

const {
  requestToJoin,
  getJoinRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/joinRequestController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:hackathonId", protect, requestToJoin);

router.get("/:hackathonId", protect, getJoinRequests);

router.put("/:requestId/accept", protect, acceptRequest);

router.put("/:requestId/reject", protect, rejectRequest);

module.exports = router;