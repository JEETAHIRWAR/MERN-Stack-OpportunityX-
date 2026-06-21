import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 150 },
    recruiterName: { type: String, trim: true, maxlength: 100, default: "" },
    officialEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
      default: "",
    },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    website: { type: String, trim: true, maxlength: 2000, default: "" },
    linkedinUrl: { type: String, trim: true, maxlength: 2000, default: "" },
    location: { type: String, trim: true, maxlength: 150, default: "" },
    companySize: {
      type: String,
      enum: ["", "1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
      default: "",
    },
    industry: { type: String, trim: true, maxlength: 100, default: "" },
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    designation: { type: String, trim: true, maxlength: 100, default: "" },
    registrationNumber: { type: String, trim: true, maxlength: 100, default: "" },
    logoUrl: { type: String, trim: true, maxlength: 2000, default: "" },
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified",
      index: true,
    },
    verificationNotes: { type: String, trim: true, maxlength: 2000, default: "" },
    submittedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
