const User = require("../models/User");

// GET PROFILE

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const {
            username,
            name,
            bio,
            location,
            github,
            portfolio,
            linkedin,
            college,
            year,
            lookingForTeam,
            skills,
        } = req.body;

        if (username !== undefined) user.username = username;
        if (name !== undefined) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (github !== undefined) user.github = github;
        if (portfolio !== undefined) user.portfolio = portfolio;
        if (linkedin !== undefined) user.linkedin = linkedin;
        if (college !== undefined) user.college = college;
        if (year !== undefined) user.year = year;
        if (lookingForTeam !== undefined)
            user.lookingForTeam = lookingForTeam;
        if (skills !== undefined) user.skills = skills;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
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
    getMe,
    updateProfile,
};