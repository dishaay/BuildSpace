const User = require("../models/User");
const { getContributionCalendar } = require("../services/githubService");

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate(
                "projects",
                "_id title description thumbnail techStack status"
            )
            .populate(
                "hackathons",
                "_id name date role result"
            );

        return res.status(200).json({
            success: true,
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

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select(
            "name username bio avatar"
        );

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
 
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(
            req.params.id
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// GET /users/github/:username/contributions
const getGithubContributions = async (req, res) => {
  try {
    const { username } = req.params;
 
    const calendar = await getContributionCalendar(username);
 
    res.status(200).json({
      success: true,
      message: "Contributions fetched successfully",
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
    });
  } catch (error) {
    console.error("getGithubContributions error:", error);
    res.status(502).json({
      success: false,
      message: error.message || "Couldn't fetch GitHub contributions",
    });
  }
};
 

module.exports = {
    getMe,
    updateProfile,
    getGithubContributions,
    getUsers,
        getUserById,

};