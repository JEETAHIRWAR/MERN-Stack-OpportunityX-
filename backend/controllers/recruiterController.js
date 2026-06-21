import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

export const getRecruiterDashboard = async (req, res) => {
  const jobIds = await Job.find({ createdBy: req.user._id }).distinct("_id");
  const [jobs, applications, statusBreakdown] = await Promise.all([
    Job.countDocuments({ createdBy: req.user._id }),
    Application.countDocuments({ jobId: { $in: jobIds } }),
    Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  return res.status(200).json({
    stats: { jobs, applications },
    statusBreakdown,
  });
};

export const getCompany = async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  return res.status(200).json({ company });
};

export const updateCompany = async (req, res) => {
  const fields = [
    "name",
    "recruiterName",
    "officialEmail",
    "phone",
    "website",
    "linkedinUrl",
    "location",
    "companySize",
    "industry",
    "description",
    "designation",
    "registrationNumber",
    "logoUrl",
  ];
  const update = Object.fromEntries(
    fields
      .filter((field) => req.body[field] !== undefined)
      .map((field) => [field, req.body[field]])
  );

  if (!update.name) {
    const existing = await Company.findOne({ owner: req.user._id });
    if (!existing) {
      return res.status(400).json({ message: "Company name is required" });
    }
  }

  const company = await Company.findOneAndUpdate(
    { owner: req.user._id },
    { $set: update, $setOnInsert: { owner: req.user._id } },
    { new: true, upsert: true, runValidators: true }
  );
  return res.status(200).json({ company });
};

export const submitCompanyForVerification = async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    return res.status(400).json({ message: "Complete your recruiter profile first" });
  }

  const required = [
    company.name,
    company.recruiterName,
    company.officialEmail,
    company.phone,
    company.location,
    company.companySize,
    company.industry,
    company.description,
    company.designation,
  ];
  if ((!company.website && !company.linkedinUrl) || required.some((value) => !value)) {
    return res.status(400).json({
      message: "Complete all required company and recruiter fields before submission",
    });
  }

  company.verificationStatus = "pending";
  company.verificationNotes = "";
  company.submittedAt = new Date();
  await company.save();
  return res.status(200).json({ company });
};
