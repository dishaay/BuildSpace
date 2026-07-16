const JoinRequest = require("../models/JoinRequest");
const Hackathon = require("../models/Hackathon");

// =============================
// Send Join Request
// =============================
const requestToJoin = async (req, res) => {
  try {
    const { hackathonId } = req.params;
    const { message } = req.body;

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own hackathon",
      });
    }

    if (hackathon.status !== "Open") {
      return res.status(400).json({
        success: false,
        message: "Hackathon is not accepting requests",
      });
    }

    if (hackathon.members.length >= hackathon.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: "Hackathon team is already full",
      });
    }

    const existingRequest = await JoinRequest.findOne({
      user: req.user._id,
      hackathon: hackathonId,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You have already requested to join",
      });
    }

    const request = await JoinRequest.create({
      user: req.user._id,
      hackathon: hackathonId,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Join request sent successfully",
      request,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// View Pending Requests
// =============================
// =============================
// View Pending Requests
// =============================
const getJoinRequests = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    console.log("PARAM ID:", hackathonId);

    const hackathon = await Hackathon.findById(
      hackathonId
    ).populate(
      "members",
      "username avatar bio skills name github portfolio linkedin"
    );

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    console.log(
      "HACKATHON ID:",
      hackathon._id.toString()
    );

    console.log(
      "CREATED BY:",
      hackathon.createdBy.toString()
    );

    console.log(
      "CURRENT USER:",
      req.user._id.toString()
    );

    console.log(
      "MEMBERS:",
      hackathon.members
    );

    if (
      hackathon.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      success: true,
      requests: hackathon.members,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =============================
// Accept Request
// =============================
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const hackathon = await Hackathon.findById(request.hackathon);

    if (
      hackathon.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (hackathon.members.length >= hackathon.maxTeamSize) {
      return res.status(400).json({
        success: false,
        message: "Team is already full",
      });
    }

    hackathon.members.push(request.user);

    if (hackathon.members.length >= hackathon.maxTeamSize) {
      hackathon.status = "Full";
    }

    await hackathon.save();

    request.status = "Accepted";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request accepted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Reject Request
// =============================
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await JoinRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const hackathon = await Hackathon.findById(request.hackathon);

    if (
      hackathon.createdBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    request.status = "Rejected";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
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
  requestToJoin,
  getJoinRequests,
  acceptRequest,
  rejectRequest,
};