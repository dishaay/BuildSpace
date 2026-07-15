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

    const request = new JoinRequest({
      user: req.user._id,
      hackathon: hackathonId,
      message,
    });

    await request.save();

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
// View Requests (Creator)
// =============================
const getJoinRequests = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    const hackathon = await Hackathon.findById(hackathonId);

    if (!hackathon) {
      return res.status(404).json({
        success: false,
        message: "Hackathon not found",
      });
    }

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const hackathonWithMembers = await Hackathon.findById(hackathonId)
      .populate(
        "members",
        "username avatar bio skills name github portfolio linkedin"
      );
      console.log(hackathonWithMembers.members);
    return res.status(200).json({
      success: true,
      requests: hackathonWithMembers.members,
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

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
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

    request.status = "Accepted";
    await request.save();

    hackathon.members.push(request.user);

    if (hackathon.members.length >= hackathon.maxTeamSize) {
      hackathon.status = "Full";
    }

    await hackathon.save();

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

    if (hackathon.createdBy.toString() !== req.user._id.toString()) {
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