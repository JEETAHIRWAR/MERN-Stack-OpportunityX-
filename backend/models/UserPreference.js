import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    theme: { type: String, enum: ["system", "light", "dark"], default: "system" },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: false },
    jobAlerts: { type: Boolean, default: true },
    messageNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("UserPreference", userPreferenceSchema);
