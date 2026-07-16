const express = require(
    "express"
);

const router =
    express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    toggleBookmark,
} = require(
    "../controllers/bookmarkController"
);

router.post(
    "/:projectId",
    protect,
    toggleBookmark
);

module.exports = router;