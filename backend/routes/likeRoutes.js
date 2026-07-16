const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    toggleLike,
} = require("../controllers/likeController");

router.post(
    "/:projectId",
    protect,
    toggleLike
);

module.exports = router;