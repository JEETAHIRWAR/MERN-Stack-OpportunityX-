import Job from "../models/Job.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import { sanitizeRichText } from "../utils/sanitizeRichText.js";

const writableFields = [
  "title",
  "description",
  "company",
  "location",
  "applyLink",
  "applicationStartDate",
  "applicationEndDate",
  "category",
  "experience",
  "jobType",
  "skills",
  "employmentType",
  "status",
];

const pickJobFields = (body) =>
  writableFields.reduce((result, field) => {
    if (body[field] !== undefined) {
      const value =
        body[field] === "" &&
        ["applicationStartDate", "applicationEndDate"].includes(field)
          ? null
          : body[field];
      result[field] = field === "description" ? sanitizeRichText(value) : value;
    }
    return result;
  }, {});

const hasValidApplyLink = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const canManageJob = (user, job) =>
  user.role === "admin" ||
  (user.role === "recruiter" &&
    job.createdBy?.toString() === user._id.toString());

export const createJob = async (req, res) => {
  if (!hasValidApplyLink(req.body.applyLink)) {
    return res.status(400).json({ message: "A valid HTTP(S) apply URL is required" });
  }
  try {
    const job = await Job.create({
      ...pickJobFields(req.body),
      createdBy: req.user._id,
    });
    return res.status(201).json(job);
  } catch (error) {
    return res.status(400).json({ message: "Unable to create job" });
  }
};

export const getJobs = async (req, res) => {
  const filter = { status: "Published" };
  const { search, location, category, experience, jobType } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);

  if (search) {
    filter.$text = { $search: search };
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (category) filter.category = category;
  if (experience) filter.experience = experience;
  if (jobType) filter.jobType = jobType;

  try {
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate("createdBy", "username role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Job.countDocuments(filter),
    ]);
    return res.status(200).json({
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch jobs" });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "createdBy",
      "username role"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch job" });
  }
};

export const updateJob = async (req, res) => {
  if (
    req.body.applyLink !== undefined &&
    !hasValidApplyLink(req.body.applyLink)
  ) {
    return res.status(400).json({ message: "A valid HTTP(S) apply URL is required" });
  }
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Recruiters are restricted to their own records; admins can correct any
    // listing. Legacy jobs without an owner remain admin-only.
    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ message: "You cannot edit this job" });
    }

    // Assign ownership when an admin first edits a pre-upgrade legacy job.
    if (!job.createdBy && req.user.role === "admin") {
      job.createdBy = req.user._id;
    }
    Object.assign(job, pickJobFields(req.body));
    await job.save();
    return res.status(200).json(job);
  } catch (error) {
    return res.status(400).json({ message: "Unable to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ message: "You cannot delete this job" });
    }

    await Promise.all([
      job.deleteOne(),
      Application.deleteMany({ jobId: job._id }),
      SavedJob.deleteMany({ job: job._id }),
    ]);
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete job" });
  }
};

export const incrementViewCount = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update view count" });
  }
};

export const getManagedJobs = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
  const jobs = await Job.find(filter).sort({ createdAt: -1 });
  return res.status(200).json(jobs);
};
