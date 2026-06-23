import express from "express";
import {
  getRecruiterDashboard,
  getCompany,
  updateCompany,
  submitCompanyForVerification,
  getRecruiterAnalytics,
} from "../controllers/recruiterController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../middlewares/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("recruiter", "admin"));
router.get("/dashboard", asyncHandler(getRecruiterDashboard));
router.get("/analytics", asyncHandler(getRecruiterAnalytics));
router
  .route("/company")
  .get(asyncHandler(getCompany))
  .put(asyncHandler(updateCompany));
router.post("/company/submit", asyncHandler(submitCompanyForVerification));

export default router;
