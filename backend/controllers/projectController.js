const Project = require("../models/Project");
const User = require("../models/User");
const createProject = async (req,res) => {
    try {

const {
    title,
    description,
    inspiration,
    journey,
    challenges,
    futurePlans,
    techStack,
    githubLink,
    liveLink,
    tags,
    status,
} = req.body;

    if (!title || !description) {
    return res.status(400).json({
        message: "Title and Description are required"
    });
}

// req.files comes from upload.fields([{name:"thumbnail",maxCount:1},{name:"screenshots",maxCount:6}])
// on the route. Each file.path is already a full Cloudinary URL.
// Falls back to req.body.thumbnail/screenshots (plain URL strings) if no
// files were actually uploaded, so JSON-only clients still work.
const thumbnail = req.files?.thumbnail?.[0]?.path || req.body.thumbnail || "";
const screenshots = req.files?.screenshots?.length
  ? req.files.screenshots.map((file) => file.path)
  : req.body.screenshots || [];

  const project = new Project({
    title,
    description,
    inspiration,
    journey,
    challenges,
    futurePlans,
    techStack,
    githubLink,
    liveLink,
    tags,
    status,
    thumbnail,
    screenshots,
    createdBy:req.user._id
});

      await project.save();


await User.findByIdAndUpdate(
    req.user._id,
    {
        $push: {
            projects: project._id,
        },
    }
);
      return res.status(201).json({
        success: true,
        message: "Project created successfully",
        project
      })

    } catch (err) {
      console.error(err); 
      return res.status(500).json({
        message: "couldnt create the project"
      })
    }
}

const getProjects=async(req,res)=>{
  try{
    const projects= await Project.find().populate("createdBy","username avatar").sort({createdAt: -1})
    return res.status(200).json({
      success:true,
      message:"projects fetched successfully",
      projects
    })
  }

  catch(err){
    console.error(err);
    return res.status(500).json({
      message:"server error"
    })
  }
}

// POST /projects/:id/like
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const alreadyLiked = project.likes.some((likeId) => likeId.toString() === userId.toString());

    if (alreadyLiked) {
      project.likes = project.likes.filter((likeId) => likeId.toString() !== userId.toString());
    } else {
      project.likes.push(userId);
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Project liked",
      liked: !alreadyLiked,
      likesCount: project.likes.length,
    });
  } catch (error) {
    console.error("toggleLike error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the like",
    });
  }
};

// GET /projects/:id/likes — list of users who liked this project
const getProjectLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate("likes", "username name avatar");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      likes: project.likes,
      count: project.likes.length,
    });
  } catch (error) {
    console.error("getProjectLikes error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching likes",
    });
  }
};

// POST /projects/:id/bookmark
const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const alreadyBookmarked = project.bookmarks.some((bId) => bId.toString() === userId.toString());

    if (alreadyBookmarked) {
      project.bookmarks = project.bookmarks.filter((bId) => bId.toString() !== userId.toString());
    } else {
      project.bookmarks.push(userId);
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: alreadyBookmarked ? "Bookmark removed" : "Project bookmarked",
      bookmarked: !alreadyBookmarked,
      bookmarksCount: project.bookmarks.length,
    });
  } catch (error) {
    console.error("toggleBookmark error:", error);
    res.status(500).json({ success: false, message: "Something went wrong while updating the bookmark" });
  }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(
            req.params.id
        )
            .populate(
                "createdBy",
                "username avatar _id"

            );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this project",
      });
    }

    const {
      title,
      description,
      inspiration,
      journey,
      challenges,
      futurePlans,
      techStack,
      githubLink,
      liveLink,
      thumbnail,
      tags,
      status,
      screenshots,
    } = req.body;

    // Same as createProject: prefer a freshly uploaded file over a plain
    // URL string in the body, but don't overwrite the existing value if
    // neither was sent with this request.
    const uploadedThumbnail = req.files?.thumbnail?.[0]?.path;
    const uploadedScreenshots = req.files?.screenshots?.length
      ? req.files.screenshots.map((file) => file.path)
      : null;

    if (title) project.title = title;
    if (description) project.description = description;
    if (inspiration !== undefined)
  project.inspiration = inspiration;

if (journey !== undefined)
  project.journey = journey;

if (challenges !== undefined)
  project.challenges = challenges;

if (futurePlans !== undefined)
  project.futurePlans = futurePlans;

    if (techStack) project.techStack = techStack;
    if (githubLink) project.githubLink = githubLink;
    if (liveLink) project.liveLink = liveLink;
    if (uploadedThumbnail || thumbnail) project.thumbnail = uploadedThumbnail || thumbnail;
    if (tags) project.tags = tags;
    if (status) project.status = status;
    if (uploadedScreenshots || screenshots) project.screenshots = uploadedScreenshots || screenshots;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this project",
      });
    }

    await project.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject, toggleLike, toggleBookmark, getProjectLikes };