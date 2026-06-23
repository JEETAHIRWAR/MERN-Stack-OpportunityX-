import express from "express";
import { getPreferences, updatePreferences } from "../controllers/preferenceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", asyncHandler(getPreferences));
router.patch("/", asyncHandler(updatePreferences));
export default router;
