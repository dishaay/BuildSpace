const mongoose= require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
  },

  bio: {
    type: String,
  },

  location: {
    type: String,
  },

  github: {
    type: String,
  },

  portfolio: {
    type: String,
  },

  skills: {
    type: [String],
    default: [],
  },
  college: {
  type: String,
  default: "",
},

year: {
  type: String,
  default: "",
},

lookingForTeam: {
  type: Boolean,
  default: false,
},

linkedin: {
  type: String,
  default: "",
},

  avatar: {
    type: String,
    default: "",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);