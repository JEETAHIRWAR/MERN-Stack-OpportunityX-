import express from "express";
import {
  createJobAlert,
  deleteJobAlert,
  listJobAlerts,
  updateJobAlert,
} from "../controllers/jobAlertController.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authMiddleware, authorizeRoles("candidate"));
router.get("/", asyncHandler(listJobAlerts));
router.post("/", asyncHandler(createJobAlert));
router.patch("/:id", validateObjectId("id"), asyncHandler(updateJobAlert));
router.delete("/:id", validateObjectId("id"), asyncHandler(deleteJobAlert));
export default router;
