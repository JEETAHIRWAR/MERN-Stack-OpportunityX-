import multer from "multer";

const allowedResumeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const allowedImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);

const createUpload = (allowedTypes, limit) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: limit },
    fileFilter(req, file, callback) {
      if (!allowedTypes.has(file.mimetype)) {
        return callback(new Error("Unsupported file type"));
      }
      return callback(null, true);
    },
  });

export const resumeUpload = createUpload(allowedResumeTypes, 10 * 1024 * 1024);
export const logoUpload = createUpload(allowedImageTypes, 5 * 1024 * 1024);
