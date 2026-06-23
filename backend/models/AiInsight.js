import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "candidate_copilot",
        "resume_analysis",
        "job_description",
        "screening_questions",
        "candidate_summary",
        "interview_questions",
        "candidate_ranking",
        "hiring_insights",
      ],
      required: true,
      index: true,
    },
    input: { type: mongoose.Schema.Types.Mixed, default: {} },
    output: { type: mongoose.Schema.Types.Mixed, required: true },
    provider: { type: String, default: "openai" },
    model: { type: String, required: true },
  },
  { timestamps: true }
);

aiInsightSchema.index({ user: 1, type: 1, createdAt: -1 });
export default mongoose.model("AiInsight", aiInsightSchema);
