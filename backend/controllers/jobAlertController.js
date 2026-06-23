import JobAlert from "../models/JobAlert.js";

const fields = [
  "name",
  "keyword",
  "location",
  "jobType",
  "experience",
  "frequency",
  "active",
];

const pick = (body) =>
  Object.fromEntries(
    fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
  );

export const listJobAlerts = async (req, res) => {
  const alerts = await JobAlert.find({ user: req.user._id }).sort({ createdAt: -1 });
  return res.status(200).json(alerts);
};

export const createJobAlert = async (req, res) => {
  if (!req.body.name?.trim()) {
    return res.status(400).json({ message: "Alert name is required" });
  }
  const alert = await JobAlert.create({ ...pick(req.body), user: req.user._id });
  return res.status(201).json(alert);
};

export const updateJobAlert = async (req, res) => {
  const alert = await JobAlert.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: pick(req.body) },
    { new: true, runValidators: true }
  );
  if (!alert) return res.status(404).json({ message: "Job alert not found" });
  return res.status(200).json(alert);
};

export const deleteJobAlert = async (req, res) => {
  const alert = await JobAlert.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!alert) return res.status(404).json({ message: "Job alert not found" });
  return res.status(200).json({ message: "Job alert deleted" });
};
