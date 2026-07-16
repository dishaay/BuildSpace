const toggleBookmark = async (
    req,
    res
) => {
    return res.json({
        success: true,
        message:
            "Bookmark feature coming soon.",
    });
};

module.exports = {
    toggleBookmark,
};