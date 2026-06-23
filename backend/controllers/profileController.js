import Profile from "../models/Profile.js";
import SavedJob from "../models/SavedJob.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

const profileFields = [
  "name",
  "phone",
  "location",
  "skills",
  "education",
  "experience",
  "resumeUrl",
  "bio",
];

const sanitizeProfile = (body) =>
  profileFields.reduce((profile, field) => {
    if (body[field] !== undefined) {
      profile[field] =
        field === "skills" && typeof body[field] === "string"
          ? body[field]
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
          : body[field];
    }
    return profile;
  }, {});

export const getProfile = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  return res.status(200).json({
    profile: profile || {
      user: req.user._id,
      name: req.user.username,
      skills: [],
    },
  });
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: sanitizeProfile(req.body), $setOnInsert: { user: req.user._id } },
      { new: true, upsert: true, runValidators: true }
    );
    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(400).json({ message: "Unable to update profile" });
  }
};

export const getCandidateDashboard = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  const [savedCount, recentApplications, recommendedJobs] = await Promise.all([
    SavedJob.countDocuments({ user: req.user._id }),
    Application.find({ applicant: req.user._id })
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 })
      .limit(5),
    Job.find({
      status: "Published",
      ...(profile?.skills?.length
        ? { $text: { $search: profile.skills.join(" ") } }
        : {}),
    })
      .sort({ createdAt: -1 })
      .limit(6),
  ]);

  const fields = ["name", "phone", "location", "skills", "education", "experience", "bio", "resumeUrl"];
  const complete = fields.filter((field) =>
    Array.isArray(profile?.[field])
      ? profile[field].length > 0
      : Boolean(profile?.[field])
  ).length;

  return res.status(200).json({
    savedCount,
    recentApplications,
    recommendedJobs,
    profileCompletion: Math.round((complete / fields.length) * 100),
  });
};

export const getPublicProfile = async (req, res) => {
  const user = await import("../models/User.js").then(({ default: User }) =>
    User.findOne({ username: req.params.username, role: "candidate" }).select(
      "username email createdAt"
    )
  );
  if (!user) return res.status(404).json({ message: "Candidate profile not found" });
  const profile = await Profile.findOne({ user: user._id }).select(
    "name location skills education experience resumeUrl bio"
  );
  return res.status(200).json({
    user: { username: user.username, createdAt: user.createdAt },
    profile,
  });
};
