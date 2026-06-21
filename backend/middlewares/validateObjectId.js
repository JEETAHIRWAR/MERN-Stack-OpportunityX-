import mongoose from "mongoose";

// Reject malformed MongoDB identifiers before they reach Mongoose queries.
export const validateObjectId =
  (parameterName = "id") =>
  (req, res, next) => {
    const value = req.params[parameterName];

    if (!mongoose.isValidObjectId(value)) {
      return res.status(400).json({
        message: `Invalid ${parameterName}`,
      });
    }

    return next();
  };

export const validateBodyObjectId =
  (fieldName) =>
  (req, res, next) => {
    if (!mongoose.isValidObjectId(req.body[fieldName])) {
      return res.status(400).json({ message: `Invalid ${fieldName}` });
    }
    return next();
  };
