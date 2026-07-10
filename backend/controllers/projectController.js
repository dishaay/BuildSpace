const Project = require("../models/Project");

const createProject = async (req,res) => {
    try {

    const {title,description,techStack,githubLink,liveLink,thumbnail,tags,status} = req.body;

    if (!title || !description) {
    return res.status(400).json({
        message: "Title and Description are required"
    });
}

  const project = new Project({
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    tags,
    status,
    createdBy:req.user._id
});

      await project.save();

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

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id).populate(
      "createdBy",
      "username avatar"
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      project,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};const updateProject = async (req, res) => {
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
        message: "You are not authorized to update this project",
      });
    }

    const {
      title,
      description,
      techStack,
      githubLink,
      liveLink,
      thumbnail,
      tags,
      status,
    } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;
    if (githubLink) project.githubLink = githubLink;
    if (liveLink) project.liveLink = liveLink;
    if (thumbnail) project.thumbnail = thumbnail;
    if (tags) project.tags = tags;
    if (status) project.status = status;

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

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};