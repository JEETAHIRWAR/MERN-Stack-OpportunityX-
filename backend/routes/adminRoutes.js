import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  getAllApplications,
  getRecruiters,
  reviewRecruiter,
  updateUser,
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
router.get("/users", asyncHandler(getAllUsers));
router.get("/applications", asyncHandler(getAllApplications));
router.get("/recruiters", asyncHandler(getRecruiters));
router.patch(
  "/recruiters/:id/review",
  validateObjectId("id"),
  asyncHandler(reviewRecruiter)
);
router.patch(
  "/users/:id",
  validateObjectId("id"),
  asyncHandler(updateUser)
);

export default router;
