import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// Verifies the bearer token and loads the current user for all protected APIs.
export const authMiddleware = async (req, res, next) => {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    return res.status(401).json({ message: "Authentication token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User account no longer exists" });
    }
    if (user.accountStatus === "suspended") {
      return res.status(403).json({ message: "This account is suspended" });
    }

    // Old installations used the role name "user". Treat it as candidate
    // during migration so existing accounts can continue to sign in.
    if (user.role === "user") {
      user.role = "candidate";
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

// Enforces authorization on the server. Frontend route guards improve UX but
// cannot be trusted as a security boundary.
export const authorizeRoles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    return next();
  };

export const requireVerifiedRecruiter = async (req, res, next) => {
  if (req.user?.role === "admin") return next();
  if (req.body?.status === "Draft") return next();

  const { default: Company } = await import("../models/Company.js");
  const company = await Company.findOne({ owner: req.user._id }).select(
    "verificationStatus"
  );
  if (!company || company.verificationStatus !== "verified") {
    return res.status(403).json({
      message:
        "Complete your recruiter profile and receive admin verification before publishing jobs.",
      verificationStatus: company?.verificationStatus || "unverified",
    });
  }
  return next();
};
