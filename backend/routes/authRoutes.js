import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  changePassword,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  registrationLimiter,
  resetPasswordLimiter,
} from "../middlewares/rateLimiters.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", registrationLimiter, asyncHandler(register));
router.post("/login", loginLimiter, asyncHandler(login));
router.post("/verify-email", asyncHandler(verifyEmail));
router.post("/resend-verification", forgotPasswordLimiter, asyncHandler(resendVerification));
router.get("/me", authMiddleware, asyncHandler(getCurrentUser));
router.patch("/password", authMiddleware, asyncHandler(changePassword));
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  asyncHandler(forgotPassword)
);
router.post(
  "/reset-password",
  resetPasswordLimiter,
  asyncHandler(resetPassword)
);

// Google OAuth is intentionally not exposed until its server-side account
// linking and provider configuration are production-ready.
export default router;
