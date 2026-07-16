const Project = require("../models/Project");

// Toggle Like (Bookmark)
const toggleLike = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        const alreadyLiked = project.likes.includes(
            req.user._id
        );

        if (alreadyLiked) {
            project.likes = project.likes.filter(
                (id) =>
                    id.toString() !==
                    req.user._id.toString()
            );

            await project.save();

            return res.status(200).json({
                success: true,
                message: "Removed from bookmarks",
                likesCount: project.likes.length,
            });
        }

        project.likes.push(req.user._id);

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Bookmarked successfully",
            likesCount: project.likes.length,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Get all users who liked/bookmarked
const getLikes = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findById(projectId)
            .populate(
                "likes",
                "username name avatar"
            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            likes: project.likes,
            count: project.likes.length,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    toggleLike,
    getLikes,
};