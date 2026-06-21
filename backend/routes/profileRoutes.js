import express from "express";
import {
  getProfile,
  updateProfile,
  getCandidateDashboard,
} from "../controllers/profileController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

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
