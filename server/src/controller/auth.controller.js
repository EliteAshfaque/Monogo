const userModel = require("../db/model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendResetPasswordEmail } = require("../services/email.service");

async function registerUser(request, response) {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const userAlreadyExists = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (userAlreadyExists) {
      return response.status(409).json({
        message: "User Already Exists",
      });
    }

    const user = await userModel.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    response.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });

    response.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function loginUser(request, response) {
  try {
    const { email, username, password } = request.body;

    if (!password || (!email && !username)) {
      return response.status(400).json({
        message: "Email/username and password are required",
      });
    }

    const user = await userModel.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(username ? [{ username }] : []),
      ],
    });

    if (!user) {
      return response.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    response.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });

    response.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  const user = await userModel.findOne({ email: req.body.email?.toLowerCase() });
  if (!user) return res.json({ message: "If an account exists, a reset email has been sent." });
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save();
  try {
    await sendResetPasswordEmail({ to: user.email, username: user.username, resetUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}` });
  } catch (error) {
    user.resetPasswordToken = undefined; user.resetPasswordExpires = undefined; await user.save();
    return res.status(503).json({ message: "Email service is not configured" });
  }
  res.json({ message: "If an account exists, a reset email has been sent." });
}

async function resetPassword(req, res) {
  const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await userModel.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ message: "This reset link is invalid or expired" });
  if (!req.body.password || req.body.password.length < 8) return res.status(400).json({ message: "Password must contain at least 8 characters" });
  user.password = await bcrypt.hash(req.body.password, 10); user.resetPasswordToken = undefined; user.resetPasswordExpires = undefined; await user.save();
  res.json({ message: "Password updated. You can now log in." });
}

async function updateProfile(req, res) {
  const { username, email, currentPassword, newPassword } = req.body;
  const user = await userModel.findById(req.user._id);
  const nextUsername = username?.trim() || user.username;
  const nextEmail = email?.trim().toLowerCase() || user.email;
  const duplicate = await userModel.findOne({ _id: { $ne: user._id }, $or: [{ username: nextUsername }, { email: nextEmail }] });
  if (duplicate) return res.status(409).json({ message: "Username or email is already in use" });
  if (newPassword) {
    if (newPassword.length < 8) return res.status(400).json({ message: "New password must contain at least 8 characters" });
    if (!currentPassword || !await bcrypt.compare(currentPassword, user.password)) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
  }
  user.username = nextUsername; user.email = nextEmail; await user.save();
  res.json({ message: "Profile updated", user: { id: user._id, username: user.username, email: user.email, role: user.role, plan: user.plan } });
}

module.exports = {
  registerUser,
  loginUser,
  me: (req, res) => res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role, plan: req.user.plan } }),
  logout: (_req, res) => { res.clearCookie("token"); res.json({ message: "Logged out" }); },
  forgotPassword,
  resetPassword,
  updateProfile,
};
