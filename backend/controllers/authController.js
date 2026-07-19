const generateToken = require("../utils/generateTokens");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Send Welcome Email
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to BuildSpace 🚀",
        html: `
          <h1>Welcome to BuildSpace!</h1>

          <p>Hi ${user.username},</p>

          <p>We're excited to have you here.</p>

          <p>
            BuildSpace is where developers showcase projects,
            discover hackathons, and connect with other builders.
          </p>

          <p>Happy building!</p>

          <br/>

          <p>- Team BuildSpace</p>
        `,
      });

      console.log("Welcome email sent successfully.");
    } catch (emailError) {
      console.log("Failed to send welcome email:");
      console.log(emailError);
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare passwords
    const checkPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.resetOTP = otp;
        user.resetOTPExpires =
            Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail({
    to: email,
    subject: "Reset Your BuildSpace Password",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
            <h1 style="color: #7C3AED;">BuildSpace</h1>

            <p>Hello,</p>

            <p>We received a request to reset your BuildSpace account password.</p>

            <p>Please use the following One-Time Password (OTP) to continue:</p>

            <div style="
                background-color: #f4f4f5;
                padding: 15px;
                text-align: center;
                border-radius: 8px;
                margin: 20px 0;
            ">
                <h2 style="margin: 0; letter-spacing: 4px;">${otp}</h2>
            </div>

            <p>This OTP is valid for <strong>10 minutes</strong>.</p>

            <p>If you did not request a password reset, you can safely ignore this email.</p>

            <br />

            <p>Happy building!</p>
            <p><strong>— The BuildSpace Team</strong></p>
        </div>
    `,
});

        return res.json({
            success: true,
            message: "OTP sent successfully.",
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
        } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (
            user.resetOTP !== otp ||
            user.resetOTPExpires < Date.now()
        ) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
            });
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        user.resetOTP = undefined;
        user.resetOTPExpires = undefined;

        await user.save();

        res.json({
            success: true,
            message:
                "Password reset successfully.",
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};