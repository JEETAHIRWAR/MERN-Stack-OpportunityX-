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

export const moderateJob = async (req, res) => {
  const { status, reason = "" } = req.body;
  if (!["approved", "flagged", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid moderation status" });
  }
  if (status !== "approved" && !reason.trim()) {
    return res.status(400).json({ message: "A moderation reason is required" });
  }
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {
      moderationStatus: status,
      moderationReason: reason,
      moderatedAt: new Date(),
      moderatedBy: req.user._id,
    },
    { new: true, runValidators: true }
  );
  if (!job) return res.status(404).json({ message: "Job not found" });
  return res.status(200).json(job);
};

const monthStart = (monthsAgo) => {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCMonth(date.getUTCMonth() - monthsAgo);
  return date;
};

export const getAdminAnalytics = async (req, res) => {
  const start = monthStart(5);
  const groupByMonth = {
    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
    count: { $sum: 1 },
  };
  const [users, jobs, applications, popularSkills] = await Promise.all([
    User.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: groupByMonth }, { $sort: { _id: 1 } }]),
    Job.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: groupByMonth }, { $sort: { _id: 1 } }]),
    Application.aggregate([{ $match: { createdAt: { $gte: start } } }, { $group: groupByMonth }, { $sort: { _id: 1 } }]),
    Job.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: { $toLower: "$skills" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);
  return res.status(200).json({ series: { users, jobs, applications }, popularSkills });
};

export const getAdminReport = async (req, res) => {
  const [usersByRole, jobsByStatus, applicationsByStatus, recruitersByStatus] =
    await Promise.all([
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Company.aggregate([{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }]),
    ]);
  return res.status(200).json({
    generatedAt: new Date(),
    usersByRole,
    jobsByStatus,
    applicationsByStatus,
    recruitersByStatus,
  });
};
