import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";

export const getAdminDashboard = async (req, res) => {
  const [users, jobs, applications, candidates, recruiters] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    User.countDocuments({ role: { $in: ["candidate", "user"] } }),
    User.countDocuments({ role: "recruiter" }),
  ]);

  return res.status(200).json({
    stats: {
      users,
      jobs,
      applications,
      candidates,
      recruiters,
      applicationsPerJob:
        jobs > 0 ? Number((applications / jobs).toFixed(2)) : 0,
    },
  });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find()
    .select("username email role accountStatus createdAt")
    .sort({ createdAt: -1 });
  return res.status(200).json(users);
};

export const updateUser = async (req, res) => {
  const allowed = {};
  if (["candidate", "recruiter", "admin"].includes(req.body.role)) {
    allowed.role = req.body.role;
  }
  if (["active", "suspended"].includes(req.body.accountStatus)) {
    allowed.accountStatus = req.body.accountStatus;
  }
  const user = await User.findByIdAndUpdate(req.params.id, allowed, {
    new: true,
    runValidators: true,
  }).select("username email role accountStatus createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.status(200).json(user);
};

export const getRecruiters = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.verificationStatus = req.query.status;
  const companies = await Company.find(filter)
    .populate("owner", "username email accountStatus")
    .sort({ submittedAt: -1, createdAt: -1 });
  return res.status(200).json(companies);
};

export const reviewRecruiter = async (req, res) => {
  const { status, notes = "" } = req.body;
  if (!["verified", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be verified or rejected" });
  }
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    {
      verificationStatus: status,
      verificationNotes: notes,
      reviewedAt: new Date(),
      reviewedBy: req.user._id,
    },
    { new: true, runValidators: true }
  );
  if (!company) return res.status(404).json({ message: "Company not found" });
  return res.status(200).json(company);
};

export const getAllApplications = async (req, res) => {
  const applications = await Application.find()
    .populate("jobId", "title company")
    .populate("applicant", "username email")
    .sort({ createdAt: -1 });
  return res.status(200).json(applications);
};
