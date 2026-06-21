import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  incrementViewCount,
  getManagedJobs,
} from "../controllers/jobController.js";
import {
  authMiddleware,
  authorizeRoles,
  requireVerifiedRecruiter,
} from "../middlewares/authMiddleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";
import { viewCountLimiter } from "../middlewares/rateLimiters.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getJobs));
router.get(
  "/managed",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  asyncHandler(getManagedJobs)
);
router.post(
  "/",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  requireVerifiedRecruiter,
  asyncHandler(createJob)
);

router.put(
  "/:id/view",
  viewCountLimiter,
  validateObjectId("id"),
  asyncHandler(incrementViewCount)
);

router
  .route("/:id")
  .all(validateObjectId("id"))
  .get(asyncHandler(getJobById))
  .put(
    authMiddleware,
    authorizeRoles("recruiter", "admin"),
    requireVerifiedRecruiter,
    asyncHandler(updateJob)
  )
  .delete(
    authMiddleware,
    authorizeRoles("recruiter", "admin"),
    asyncHandler(deleteJob)
  );

export default router;
