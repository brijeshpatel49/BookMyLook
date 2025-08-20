const User = require("../models/user-model");
const OTP = require("../models/otp-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTPEmail } = require("../utils/EmailService");

const sendRegistrationOTP = async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !phone || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.status(400).json({
        message: "Phone Number already exists",
      });
    }

    // Check if username is taken
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({
        message: "Username already taken",
      });
    }

    // Hash password
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password, saltRound);

    // Generate OTP
    const otp = generateOTP();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Save OTP and user data temporarily
    await OTP.create({
      email,
      otp,
      username,
      password: hash_password,
      phone,
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, username);

    if (!emailResult.success) {
      await OTP.deleteOne({ email });
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(200).json({
      message: "OTP sent successfully to your email",
      email: email,
    });
  } catch (error) {
    console.error("Registration OTP error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Step 2: Verify OTP and complete registration
const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    // Create user account
    const user = await User.create({
      username: otpRecord.username,
      email: otpRecord.email,
      phone: otpRecord.phone,
      password: otpRecord.password,
      isVerified: true,
    });

    // Delete OTP record
    await OTP.deleteOne({ email });

    res.status(201).json({
      msg: "Registation Successful",
      token: await user.generateToken(),
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Find existing OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        message: "No registration found for this email",
      });
    }

    // Generate new OTP
    const newOTP = generateOTP();

    // Update OTP record
    otpRecord.otp = newOTP;
    otpRecord.createdAt = new Date();
    await otpRecord.save();

    // Send new OTP email
    const emailResult = await sendOTPEmail(email, newOTP, otpRecord.username);

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(200).json({
      message: "New OTP sent successfully",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const user = await userExist.comparePassword(password);

    if (user) {
      res.status(200).json({
        msg: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ msg: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json("internal server error");
  }
};

// to send user data

const user = async (req, res) => {
  try {
    const userData = req.user;
    return res.status(200).json({ userData });
  } catch (error) {
    console.log("error from user route", error);
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, phone } = req.body;

    const updateFields = {};
    if (typeof username === "string") updateFields.username = username;
    if (typeof phone === "string" || typeof phone === "number")
      updateFields.phone = phone;

    // ✅ Only check for phone duplication if phone is being changed
    if (updateFields.phone) {
      // First, get the current user to compare phone numbers
      const currentUser = await User.findById(id);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only check for duplicates if the new phone is different from current phone
      if (currentUser.phone !== updateFields.phone) {
        const phoneExist = await User.findOne({
          phone: updateFields.phone,
          _id: { $ne: id }, // Exclude current user from check
        });
        if (phoneExist) {
          return res.status(400).json({
            message: "Phone number already exists",
          });
        }
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Check if OTP record already exists for this email
    let otpRecord = await OTP.findOne({ email });

    if (otpRecord) {
      // Update existing record
      otpRecord.otp = otp;
      otpRecord.createdAt = new Date();
      await otpRecord.save();
    } else {
      // Create new OTP record
      otpRecord = new OTP({
        email,
        otp,
        username: user.username, // Use actual username from user
      });
      await otpRecord.save();
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, user.username);

    if (!emailResult.success) {
      return res.status(500).json({
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const forgotVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({
        message: "No OTP found for this email",
      });
    }

    // Check if OTP is valid and not expired
    const currentTime = new Date();
    const otpTime = new Date(otpRecord.createdAt);
    const timeDifference = (currentTime - otpTime) / 1000; // in seconds

    if (timeDifference > 300) {
      // 5 minutes expiry
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP, and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Verify OTP one more time before password reset
    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    const currentTime = new Date();
    const otpTime = new Date(otpRecord.createdAt);
    const timeDifference = (currentTime - otpTime) / 1000;

    if (timeDifference > 300) {
      // 5 minutes expiry
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    // Delete OTP record after successful password reset
    await OTP.findByIdAndDelete(otpRecord._id);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
module.exports = {
  login,
  user,
  updateUser,
  sendRegistrationOTP,
  verifyOTPAndRegister,
  resendOTP,
  forgotPassword,
  forgotVerify,
  resetPassword,
};
