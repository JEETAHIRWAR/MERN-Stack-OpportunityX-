export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
    requestId: req.requestId,
  });
};

// Centralize unexpected failures so stack traces stay server-side while every
// client receives a consistent, traceable response shape.
export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || error.statusCode || 500;
  if (process.env.NODE_ENV !== "test") {
    console.error(
      JSON.stringify({
        level: "error",
        event: "unhandled_error",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
      })
    );
  }

  return res.status(status).json({
    message: status >= 500 ? "Internal server error" : error.message,
    requestId: req.requestId,
  });
};
