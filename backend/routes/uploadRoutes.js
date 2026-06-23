import express from "express";
import { uploadCompanyLogo, uploadResume } from "../controllers/uploadController.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import { logoUpload, resumeUpload } from "../middlewares/uploadMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.post(
  "/resume",
  authMiddleware,
  authorizeRoles("candidate"),
  resumeUpload.single("file"),
  asyncHandler(uploadResume)
);
router.post(
  "/company-logo",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  logoUpload.single("file"),
  asyncHandler(uploadCompanyLogo)
);
export default router;
