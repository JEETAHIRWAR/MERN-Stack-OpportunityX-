import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import
  {
    errorHandler,
    notFoundHandler,
  } from "./middlewares/errorMiddleware.js";

dotenv.config({ path: "./.env" });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(",")
  .map(origin => origin.trim()) || [];

app.use(
  cors({
    origin(origin, callback)
    {
      // Postman requests
      if (!origin)
      {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin))
      {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} not allowed by CORS`)
      );
    },
    credentials: true,
  })
);

const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
if (trustProxyHops > 0)
{
  app.set("trust proxy", trustProxyHops);
}

app.disable("x-powered-by");
app.use(requestLogger);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...allowedOrigins],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(
  cors({
    origin(origin, callback)
    {
      // Server-to-server and same-origin requests do not include Origin.
      if (!origin || allowedOrigins.includes(origin))
      {
        return callback(null, true);
      }

      const error = new Error("Origin is not allowed by CORS");
      error.status = 403;
      return callback(error);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  })
);

app.get("/api/health", (req, res) =>
{
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api", notFoundHandler);

// Support a combined deployment when frontend/dist has been built. Separate
// frontend hosting remains supported because this block is conditional.
const frontendDist = path.resolve(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist))
{
  app.use(express.static(frontendDist));
  app.get("*", (req, res) =>
  {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

app.use(errorHandler);

export default app;
