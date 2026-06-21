import express from "express";
import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", asyncHandler(getNotifications));
router.patch(
  "/:id/read",
  validateObjectId("id"),
  asyncHandler(markNotificationRead)
);

export default router;
