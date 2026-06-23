import Application from "../models/Application.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const isParticipant = (conversation, userId) =>
  conversation.participants.some((participant) => participant.toString() === userId.toString());

export const listConversations = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .populate("participants", "username email role")
    .populate({ path: "application", populate: { path: "jobId", select: "title company" } })
    .sort({ lastMessageAt: -1 });
  return res.status(200).json(conversations);
};

export const createConversation = async (req, res) => {
  const application = await Application.findById(req.body.applicationId).populate(
    "jobId",
    "createdBy"
  );
  if (!application || !application.applicant) {
    return res.status(404).json({ message: "Application not found" });
  }
  const job = application.jobId;
  const candidateId = application.applicant.toString();
  const recruiterId = job.createdBy?.toString();
  const currentId = req.user._id.toString();
  const allowed =
    req.user.role === "admin" ||
    currentId === candidateId ||
    (req.user.role === "recruiter" && currentId === recruiterId);
  if (!allowed || !recruiterId) {
    return res.status(403).json({ message: "Conversation access denied" });
  }

  const conversation = await Conversation.findOneAndUpdate(
    { application: application._id },
    {
      $setOnInsert: {
        application: application._id,
        participants: [application.applicant, job.createdBy],
      },
    },
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(200).json(conversation);
};

export const listMessages = async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation || !isParticipant(conversation, req.user._id)) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  const messages = await Message.find({ conversation: conversation._id })
    .populate("sender", "username role")
    .sort({ createdAt: 1 })
    .limit(200);
  await Message.updateMany(
    { conversation: conversation._id, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );
  return res.status(200).json(messages);
};

export const sendMessage = async (req, res) => {
  const body = req.body.body?.trim();
  if (!body) return res.status(400).json({ message: "Message body is required" });
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation || !isParticipant(conversation, req.user._id)) {
    return res.status(404).json({ message: "Conversation not found" });
  }
  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    body,
    readBy: [req.user._id],
  });
  conversation.lastMessageAt = new Date();
  await conversation.save();
  req.app.get("io")?.to(`conversation:${conversation._id}`).emit("message:new", {
    ...message.toObject(),
    sender: {
      _id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    },
  });
  return res.status(201).json(message);
};
