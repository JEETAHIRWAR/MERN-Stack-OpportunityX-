import mongoose from "mongoose";

export const APPLICATION_STATUSES = [
  "Applied",
  "Reviewing",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
  "Withdrawn",
];

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    // Identity comes from the verified JWT, not from editable browser fields.
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "Applied",
      index: true,
    },
    recruiterNotes: { type: String, trim: true, maxlength: 3000, default: "" },
  },
  { timestamps: true }
);

// Enforce duplicate protection at the database layer to avoid race conditions.
applicationSchema.index(
  { jobId: 1, applicant: 1 },
  {
    unique: true,
    // Legacy application rows did not have an applicant reference. Excluding
    // those rows allows a safe rolling migration without index build failures.
    partialFilterExpression: { applicant: { $type: "objectId" } },
  }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
