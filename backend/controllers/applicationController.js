import Application, {
  APPLICATION_STATUSES,
} from "../models/Application.js";
import Job from "../models/Job.js";
import Profile from "../models/Profile.js";
import Notification from "../models/Notification.js";

const canReviewJob = (user, job) =>
  user.role === "admin" ||
  (user.role === "recruiter" &&
    job.createdBy?.toString() === user._id.toString());

export const createApplication = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const profile = await Profile.findOne({ user: req.user._id });
    const application = await Application.create({
      jobId: job._id,
      applicant: req.user._id,
      name: profile?.name || req.user.username,
      email: req.user.email,
    });

    return res.status(201).json(application);
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json({ message: "You have already applied for this job" });
    }
    return res.status(400).json({ message: "Unable to submit application" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("jobId", "title company location jobType")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch applications" });
  }
};

export const getApplicationsByJobId = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (!canReviewJob(req.user, job)) {
      return res.status(403).json({ message: "You cannot view these applicants" });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate("applicant", "username email")
      .sort({ createdAt: -1 });
    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch applicants" });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      "jobId"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const isApplicant =
      application.applicant?.toString() === req.user._id.toString();
    const canReview = canReviewJob(req.user, application.jobId);
    if (!isApplicant && !canReview) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch application" });
  }
};

export const checkApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({
      jobId: req.params.jobId,
      applicant: req.user._id,
    }).select("status");
    return res.json({
      hasApplied: Boolean(application),
      status: application?.status || null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to check application status" });
  }
};

export const updateApplication = async (req, res) => {
  const { status, recruiterNotes } = req.body;

  if (status && !APPLICATION_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid application status" });
  }

  try {
    const application = await Application.findById(req.params.id).populate(
      "jobId",
      "title createdBy"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (!canReviewJob(req.user, application.jobId)) {
      return res.status(403).json({ message: "You cannot update this application" });
    }

    if (status) application.status = status;
    if (recruiterNotes !== undefined) {
      application.recruiterNotes = recruiterNotes;
    }
    await application.save();

    if (status && application.applicant) {
      await Notification.create({
        user: application.applicant,
        title: "Application status updated",
        message: `${application.jobId.title}: ${status}`,
        type: "application",
        link: "/my-applications",
      });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(400).json({ message: "Unable to update application" });
  }
};
