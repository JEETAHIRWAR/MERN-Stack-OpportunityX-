import express from "express";
import {
  getProfile,
  updateProfile,
  getCandidateDashboard,
  getPublicProfile,
} from "../controllers/profileController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/public/:username", asyncHandler(getPublicProfile));

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("candidate", "admin"),
  asyncHandler(getCandidateDashboard)
);
router
  .route("/me")
  .all(authMiddleware, authorizeRoles("candidate", "admin"))
  .get(asyncHandler(getProfile))
  .put(asyncHandler(updateProfile));

export default router;
