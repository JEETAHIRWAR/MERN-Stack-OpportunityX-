import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";

export const getSavedJobs = async (req, res) => {
  const savedJobs = await SavedJob.find({ user: req.user._id })
    .populate("job")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(savedJobs.filter((savedJob) => savedJob.job).map(({ job }) => job));
};

export const getSavedJobStatus = async (req, res) => {
  const savedJob = await SavedJob.findOne({
    user: req.user._id,
    job: req.params.jobId,
  });
  return res.status(200).json({ saved: Boolean(savedJob) });
};

export const saveJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await SavedJob.updateOne(
    { user: req.user._id, job: job._id },
    { $setOnInsert: { user: req.user._id, job: job._id } },
    { upsert: true }
  );
  return res.status(201).json({ message: "Job saved" });
};

export const unsaveJob = async (req, res) => {
  await SavedJob.deleteOne({ user: req.user._id, job: req.params.jobId });
  return res.status(200).json({ message: "Job removed from saved jobs" });
};
