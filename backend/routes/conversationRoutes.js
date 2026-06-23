import express from "express";
import {
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
} from "../controllers/conversationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateObjectId, validateBodyObjectId } from "../middlewares/validateObjectId.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/", asyncHandler(listConversations));
router.post("/", validateBodyObjectId("applicationId"), asyncHandler(createConversation));
router.get("/:id/messages", validateObjectId("id"), asyncHandler(listMessages));
router.post("/:id/messages", validateObjectId("id"), asyncHandler(sendMessage));
export default router;
