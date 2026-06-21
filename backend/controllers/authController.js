import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import Company from "../models/Company.js";

const PUBLIC_ROLES = ["candidate", "recruiter"];

const normalizeRole = (role) => (role === "user" ? "candidate" : role);

// Explicitly shape every auth response so credentials and reset fields can
// never be serialized to the browser.
const toSafeUser = (user, verificationStatus) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  role: normalizeRole(user.role),
  accountStatus: user.accountStatus || "active",
  verificationStatus:
    normalizeRole(user.role) === "recruiter"
      ? verificationStatus || "unverified"
      : undefined,
  createdAt: user.createdAt,
});

const getVerificationStatus = async (user) => {
  if (normalizeRole(user.role) !== "recruiter") return undefined;
  const company = await Company.findOne({ owner: user._id }).select(
    "verificationStatus"
  );
  return company?.verificationStatus || "unverified";
};

const createToken = (user) =>
  jwt.sign(
    { id: user._id, role: normalizeRole(user.role) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );

export const register = async (req, res) => {
  const username = req.body.username?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;
  const requestedRole = req.body.role || "candidate";

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  let role = requestedRole;
  if (role === "admin") {
    if (
      !process.env.ADMIN_REGISTRATION_CODE ||
      req.body.code !== process.env.ADMIN_REGISTRATION_CODE
    ) {
      return res.status(403).json({ message: "Admin registration is disabled" });
    }
  } else if (!PUBLIC_ROLES.includes(role)) {
    role = "candidate";
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    const user = await User.create({ username, email, password, role });
    const verificationStatus = await getVerificationStatus(user);
    return res.status(201).json({
      token: createToken(user),
      user: toSafeUser(user, verificationStatus),
    });
  } catch (error) {
    return res.status(500).json({ message: "User registration failed" });
  }
};

export const login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Normalize accounts created before the candidate/recruiter role upgrade.
    if (user.role === "user") {
      user.role = "candidate";
      await User.updateOne({ _id: user._id }, { role: "candidate" });
    }

    const verificationStatus = await getVerificationStatus(user);
    return res.status(200).json({
      token: createToken(user),
      user: toSafeUser(user, verificationStatus),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  const verificationStatus = await getVerificationStatus(req.user);
  return res.status(200).json({
    user: toSafeUser(req.user, verificationStatus),
  });
};

export const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const genericMessage =
    "If an account exists for that email, a password reset link has been sent";

  try {
    const user = await User.findOne({ email }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    // A generic response prevents attackers from discovering registered emails.
    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const message = `
      <div style="font-family: Arial, sans-serif; color: #1f2937;">
        <h2>Reset your OpportunityX password</h2>
        <p>This link expires in one hour.</p>
        <p><a href="${resetUrl}">Reset password</a></p>
        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: "Reset your OpportunityX password",
      message,
    });

    return res.status(200).json({ message: genericMessage });
  } catch (error) {
    return res.status(500).json({ message: "Unable to send reset email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password || password.length < 8) {
    return res.status(400).json({
      message: "A valid token and password of at least 8 characters are required",
    });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to reset password" });
  }
};
