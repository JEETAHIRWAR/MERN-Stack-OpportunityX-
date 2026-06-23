import express from "express";
import {
  analyzeResume,
  candidateCopilot,
  listAiInsights,
  recommendJobs,
  recruiterCopilot,
  rankApplicants,
  generateHiringInsights,
} from "../controllers/aiController.js";
import { authMiddleware, authorizeRoles } from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { aiLimiter } from "../middlewares/rateLimiters.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

const router = express.Router();
router.use(authMiddleware, aiLimiter);
router.get("/insights", asyncHandler(listAiInsights));
router.post("/candidate/copilot", authorizeRoles("candidate"), asyncHandler(candidateCopilot));
router.post("/resume/analyze", authorizeRoles("candidate"), asyncHandler(analyzeResume));
router.post("/recommendations/jobs", authorizeRoles("candidate"), asyncHandler(recommendJobs));
router.post("/recruiter/copilot", authorizeRoles("recruiter", "admin"), asyncHandler(recruiterCopilot));
router.post(
  "/recruiter/jobs/:jobId/rank",
  authorizeRoles("recruiter", "admin"),
  validateObjectId("jobId"),
  asyncHandler(rankApplicants)
);
router.post(
  "/admin/hiring-insights",
  authorizeRoles("admin"),
  asyncHandler(generateHiringInsights)
);
export default router;
