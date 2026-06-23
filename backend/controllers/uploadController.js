import Profile from "../models/Profile.js";
import Company from "../models/Company.js";
import { uploadBuffer } from "../services/storage/cloudinaryStorage.js";

export const uploadResume = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });
  const result = await uploadBuffer({
    buffer: req.file.buffer,
    folder: `resumes/${req.user._id}`,
    resourceType: "raw",
  });
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { resumeUrl: result.secure_url }, $setOnInsert: { user: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(201).json({ url: result.secure_url, profile });
};

export const uploadCompanyLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Logo file is required" });
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) return res.status(400).json({ message: "Create the company profile first" });
  const result = await uploadBuffer({
    buffer: req.file.buffer,
    folder: `company-logos/${req.user._id}`,
    resourceType: "image",
  });
  company.logoUrl = result.secure_url;
  await company.save();
  return res.status(201).json({ url: result.secure_url, company });
};
