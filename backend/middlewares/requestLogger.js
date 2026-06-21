import crypto from "crypto";

const redactPath = (path) =>
  path.replace(/\/reset-password\/[^/?]+/g, "/reset-password/[redacted]");

// Emits one JSON record per request so logs remain searchable in Render,
// container platforms, and log aggregation services without extra packages.
export const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  req.requestId = req.header("X-Request-Id") || crypto.randomUUID();
  res.setHeader("X-Request-Id", req.requestId);

  res.on("finish", () => {
    if (process.env.NODE_ENV === "test") return;

    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const record = {
      level: res.statusCode >= 500 ? "error" : "info",
      event: "http_request",
      requestId: req.requestId,
      method: req.method,
      path: redactPath(req.originalUrl),
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userId: req.user?._id?.toString(),
    };

    console.log(JSON.stringify(record));
  });

  next();
};
