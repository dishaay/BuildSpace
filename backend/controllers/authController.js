const generateToken = require("../utils/generateTokens");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

let registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();
    const token=generateToken(user._id);

return res.status(201).json({
    success: true,
    message: "User registered successfully",
    token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
});
  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Server Error"
    });

  }
};

let loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Check if all fields are present
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // User doesn't exist
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Compare entered password with hashed password
    const checkPassword = await bcrypt.compare(password, user.password);

    // Password is incorrect
    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      message: "Server Error"
    });

  }
};

module.exports = {
  registerUser,
  loginUser
};