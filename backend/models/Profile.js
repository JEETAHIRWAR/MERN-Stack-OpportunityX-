import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, trim: true, maxlength: 100, default: "" },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    location: { type: String, trim: true, maxlength: 150, default: "" },
    skills: [{ type: String, trim: true, maxlength: 80 }],
    education: { type: String, trim: true, maxlength: 2000, default: "" },
    experience: { type: String, trim: true, maxlength: 4000, default: "" },
    resumeUrl: { type: String, trim: true, maxlength: 2000, default: "" },
    bio: { type: String, trim: true, maxlength: 2000, default: "" },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
