import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";

export const attachRealtimeServer = (httpServer) => {
  const origins = (
    process.env.CORS_ORIGINS ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(httpServer, {
    cors: { origin: origins, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role accountStatus");
      if (!user || user.accountStatus === "suspended") {
        return next(new Error("Authentication failed"));
      }
      socket.user = user;
      return next();
    } catch {
      return next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("conversation:join", async (conversationId) => {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
      }).select("_id");
      if (conversation) socket.join(`conversation:${conversation._id}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on("typing:start", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:start", {
        conversationId,
        userId: socket.user._id.toString(),
      });
    });

    socket.on("typing:stop", ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit("typing:stop", {
        conversationId,
        userId: socket.user._id.toString(),
      });
    });
  });

  return io;
};
