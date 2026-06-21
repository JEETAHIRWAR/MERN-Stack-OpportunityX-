// Express 4 does not automatically forward rejected async handlers. This
// wrapper ensures centralized error handling receives every rejected promise.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
