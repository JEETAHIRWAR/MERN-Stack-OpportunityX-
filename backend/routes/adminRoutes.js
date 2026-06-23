import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  getAllApplications,
  getRecruiters,
  reviewRecruiter,
  updateUser,
  moderateJob,
  getAdminAnalytics,
  getAdminReport,
} from "../controllers/adminController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin"));
router.get("/dashboard", asyncHandler(getAdminDashboard));
router.get("/analytics", asyncHandler(getAdminAnalytics));
router.get("/reports/summary", asyncHandler(getAdminReport));
router.get("/users", asyncHandler(getAllUsers));
router.get("/applications", asyncHandler(getAllApplications));
router.get("/recruiters", asyncHandler(getRecruiters));
router.patch(
  "/recruiters/:id/review",
  validateObjectId("id"),
  asyncHandler(reviewRecruiter)
);
router.patch(
  "/jobs/:id/moderation",
  validateObjectId("id"),
  asyncHandler(moderateJob)
);
router.patch(
  "/users/:id",
  validateObjectId("id"),
  asyncHandler(updateUser)
);

export default router;
