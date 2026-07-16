const Hackathon = require("../models/Hackathon");
const mongoose = require("mongoose");

const createHackathon = async (req, res) => {
    try {
        console.log("CREATE HIT");
        console.log("BODY:", req.body);

        const {
            title,
            description,
            officialLink,
            registrationDeadline,
            startDate,
            endDate,
            techStack,
            mode,
            location,
            prizePool,
            maxTeamSize,
        } = req.body;

    if (!title || !description || !officialLink || !maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const hackathon = new Hackathon({
      title,
      description,
      officialLink,
      registrationDeadline,
      startDate,
      endDate,
      techStack,
      mode,
      location,
      prizePool,
      maxTeamSize,
      createdBy: req.user._id,
    });

    await hackathon.save();

    return res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      hackathon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

//JOIN HACKATHON 
const joinHackathon = async (req,res)=>{
    try{

        const {id} = req.params;

        const hackathon = await Hackathon.findById(id);

        if(!hackathon){
            return res.status(404).json({
                success:false,
                message:"Hackathon not found"
            });
        }

        const alreadyJoined = hackathon.members.some(
    (member) => member.toString() === req.user._id.toString()
);

if (alreadyJoined) {
    return res.status(400).json({
        success: false,
        message: "Already joined.",
    });
}

        hackathon.members.push(req.user._id);

        if(
            hackathon.members.length >=
            hackathon.maxTeamSize
        ){
            hackathon.status="Full";
        }

        await hackathon.save();

        return res.status(200).json({
            success:true,
            message:"Joined successfully",
            hackathon
        });

    }catch(err){
        console.log(err);

        return res.status(500).json({
            success:false,
            message:"Server Error"
        });
    }
}

//GET MY HACKATHONS
const getMyHackathons = async (req, res) => {
    try {
        console.log("USER:", req.user);

        const hackathons = await Hackathon.find({
            createdBy: req.user._id,
        });

        console.log("FOUND:", hackathons);

        return res.status(200).json({
            success: true,
            hackathons,
        });
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// GET ALL HACKATHONS
const getHackathons = async (req, res) => {
    console.log("DB:", mongoose.connection.name);

    const raw = await mongoose.connection
        .db
        .collection("hackathons")
        .find({})
        .toArray();

    console.log("RAW:", raw);

    const hackathons = await Hackathon.find();

    console.log("MODEL:", hackathons);

    return res.json({
        success: true,
        hackathons,
    });
};

// GET SINGLE HACKATHON
const getHackathonById = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id)
      .populate("createdBy", "username avatar")
      .populate("members", "username avatar");

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Hackathon fetched successfully",
      hackathon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// UPDATE HACKATHON
const updateHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this hackathon",
      });
    }

    Object.assign(hackathon, req.body);

    await hackathon.save();

    return res.status(200).json({
      success: true,
      message: "Hackathon updated successfully",
      hackathon,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// DELETE HACKATHON
const deleteHackathon = async (req, res) => {
  try {
    const { id } = req.params;

    const hackathon = await Hackathon.findById(id);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this hackathon",
      });
    }

    await hackathon.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully",
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
  createHackathon,
  getHackathons,
  getMyHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  joinHackathon,
};