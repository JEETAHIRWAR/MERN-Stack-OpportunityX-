import mongoose from "mongoose";

const jobAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    keyword: { type: String, trim: true, maxlength: 150, default: "" },
    location: { type: String, trim: true, maxlength: 150, default: "" },
    jobType: { type: String, trim: true, maxlength: 50, default: "" },
    experience: { type: String, trim: true, maxlength: 50, default: "" },
    frequency: {
      type: String,
      enum: ["instant", "daily", "weekly"],
      default: "daily",
    },
    active: { type: Boolean, default: true, index: true },
    lastProcessedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

jobAlertSchema.index({ user: 1, createdAt: -1 });
export default mongoose.model("JobAlert", jobAlertSchema);
