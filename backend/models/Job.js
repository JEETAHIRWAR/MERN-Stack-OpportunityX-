import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 30000 },
    company: { type: String, required: true, trim: true, maxlength: 150 },
    location: { type: String, required: true, trim: true, maxlength: 150 },
    applyLink: { type: String, required: true, trim: true, maxlength: 2000 },
    viewCount: { type: Number, default: 0, min: 0 },
    applicationStartDate: { type: Date, default: null },
    applicationEndDate: { type: Date, default: null },
    category: {
      type: String,
      enum: ["IT", "Non-IT"],
      required: true,
      index: true,
    },
    experience: {
      type: String,
      enum: ["Fresher", "Experienced"],
      required: true,
      index: true,
    },
    jobType: {
      type: String,
      enum: ["Work from Home", "In Office"],
      required: true,
      index: true,
    },
    skills: [{ type: String, trim: true, maxlength: 80 }],
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
      index: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Paused", "Closed"],
      default: "Published",
      index: true,
    },
    moderationStatus: {
      type: String,
      enum: ["approved", "flagged", "rejected"],
      default: "approved",
      index: true,
    },
    moderationReason: { type: String, trim: true, maxlength: 2000, default: "" },
    moderatedAt: { type: Date, default: null },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    // Recruiters may manage only their own jobs. Admins receive platform-wide
    // access through controller-level ownership checks.
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", company: "text", location: "text" });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1, moderationStatus: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
