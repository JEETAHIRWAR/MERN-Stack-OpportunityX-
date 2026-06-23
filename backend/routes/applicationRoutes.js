import express from "express";
import {
  createApplication,
  getApplicationsByJobId,
  getApplicationById,
  checkApplicationStatus,
  getMyApplications,
  updateApplication,
  withdrawApplication,
} from "../controllers/applicationController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import {
  validateBodyObjectId,
  validateObjectId,
} from "../middlewares/validateObjectId.js";
import { applicationLimiter } from "../middlewares/rateLimiters.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post(
  "/",
  applicationLimiter,
  authMiddleware,
  authorizeRoles("candidate"),
  validateBodyObjectId("jobId"),
  asyncHandler(createApplication)
);
router.get(
  "/mine",
  authMiddleware,
  authorizeRoles("candidate", "admin"),
  asyncHandler(getMyApplications)
);
router.get(
  "/check/:jobId",
  authMiddleware,
  authorizeRoles("candidate"),
  validateObjectId("jobId"),
  asyncHandler(checkApplicationStatus)
);
router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  validateObjectId("jobId"),
  asyncHandler(getApplicationsByJobId)
);
router
  .route("/:id")
  .all(authMiddleware, validateObjectId("id"))
  .get(asyncHandler(getApplicationById))
  .patch(
    authorizeRoles("recruiter", "admin"),
    asyncHandler(updateApplication)
  );

router.patch(
  "/:id/withdraw",
  authMiddleware,
  authorizeRoles("candidate"),
  validateObjectId("id"),
  asyncHandler(withdrawApplication)
);

export default router;
