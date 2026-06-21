import express from "express";
import {
  getSavedJobs,
  getSavedJobStatus,
  saveJob,
  unsaveJob,
} from "../controllers/savedJobController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("candidate", "admin"));
router.get("/", asyncHandler(getSavedJobs));
router
  .route("/:jobId")
  .all(validateObjectId("jobId"))
  .get(asyncHandler(getSavedJobStatus))
  .post(asyncHandler(saveJob))
  .delete(asyncHandler(unsaveJob));

export default router;
