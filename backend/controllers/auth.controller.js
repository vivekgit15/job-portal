const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const generateResetToken = require("../utils/generateResetToken");
const resend = require("../config/resend");


// Register Controller
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    if (!name.match(/^[A-Za-z ]+$/))
      return res.status(400).json({ message: "Invalid name" });

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      return res.status(400).json({ message: "Invalid email" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const correct = await bcrypt.compare(password, user.password);
    if (!correct)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Forgot Password Controller 

  const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate token
    const token = generateResetToken(user._id);

    // Create reset URL
    // Must match frontend route in App.jsx: <Route path="/reset-password" element={<ResetPassword />} />
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Send email
    await resend.emails.send({
      from: "Job Portal <website@resend.dev>",
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hello,</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
      `
    });

    res.json({ message: "Reset link sent to your email" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);

    // Must select password explicitly
    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Find user
    const user = await User.findById(userId);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Save new password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword
};
