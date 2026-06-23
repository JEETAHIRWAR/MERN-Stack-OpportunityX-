import AiInsight from "../models/AiInsight.js";
import Profile from "../models/Profile.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { generateAiJson } from "../services/ai/openAiProvider.js";

const runAndStore = async ({ req, type, system, input }) => {
  const result = await generateAiJson({ system, input });
  await AiInsight.create({
    user: req.user._id,
    type,
    input: req.body,
    output: result.output,
    provider: result.provider,
    model: result.model,
  });
  return result;
};

export const candidateCopilot = async (req, res) => {
  if (!req.body.question?.trim()) {
    return res.status(400).json({ message: "A career question is required" });
  }
  const profile = await Profile.findOne({ user: req.user._id }).lean();
  const result = await runAndStore({
    req,
    type: "candidate_copilot",
    system:
      "You are a career copilot. Give safe, practical career guidance. Return {answer:string, actions:string[]}.",
    input: JSON.stringify({ question: req.body.question, profile }),
  });
  return res.status(200).json(result);
};

export const analyzeResume = async (req, res) => {
  const resumeText = req.body.resumeText?.trim();
  if (!resumeText || resumeText.length < 100) {
    return res.status(400).json({ message: "At least 100 characters of resume text are required" });
  }
  const result = await runAndStore({
    req,
    type: "resume_analysis",
    system:
      "Analyze a resume. Return {skills:string[],education:string[],experience:string[],certifications:string[],projects:string[],score:number,missingSkills:string[],atsRecommendations:string[]}. Score must be 0-100.",
    input: resumeText.slice(0, 30000),
  });
  return res.status(200).json(result);
};

export const recruiterCopilot = async (req, res) => {
  const actionMap = {
    job_description: "Generate an inclusive job description. Return {title:string,description:string,skills:string[]}.",
    screening_questions: "Generate job screening questions. Return {questions:{question:string,reason:string}[]}.",
    candidate_summary: "Summarize a candidate fairly. Return {summary:string,strengths:string[],risks:string[],followUps:string[]}.",
    interview_questions: "Generate structured interview questions. Return {questions:{question:string,competency:string,signal:string}[]}.",
  };
  const type = req.body.type;
  if (!actionMap[type]) return res.status(400).json({ message: "Unsupported recruiter AI action" });
  const result = await runAndStore({
    req,
    type,
    system: actionMap[type],
    input: JSON.stringify(req.body.context || {}),
  });
  return res.status(200).json(result);
};

export const recommendJobs = async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).lean();
  const jobs = await Job.find({ status: "Published" })
    .select("title company location skills experience employmentType")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  const applications = await Application.find({ applicant: req.user._id })
    .select("jobId status")
    .lean();
  const result = await runAndStore({
    req,
    type: "candidate_ranking",
    system:
      "Rank jobs for a candidate. Return {recommendations:{jobId:string,score:number,reasons:string[]}[]}. Use 0-100 scores and only supplied job IDs.",
    input: JSON.stringify({ profile, applications, jobs }),
  });
  return res.status(200).json(result);
};

export const listAiInsights = async (req, res) => {
  const insights = await AiInsight.find({ user: req.user._id })
    .select("-input")
    .sort({ createdAt: -1 })
    .limit(30);
  return res.status(200).json(insights);
};

export const rankApplicants = async (req, res) => {
  const job = await Job.findById(req.params.jobId).lean();
  if (!job) return res.status(404).json({ message: "Job not found" });
  const ownsJob =
    req.user.role === "admin" ||
    job.createdBy?.toString() === req.user._id.toString();
  if (!ownsJob) return res.status(403).json({ message: "You cannot rank these applicants" });

  const applications = await Application.find({ jobId: job._id })
    .populate("applicant", "username email")
    .lean();
  const profiles = await Profile.find({
    user: { $in: applications.map((item) => item.applicant?._id).filter(Boolean) },
  }).lean();
  const profilesByUser = new Map(
    profiles.map((profile) => [profile.user.toString(), profile])
  );
  const candidates = applications.map((application) => ({
    applicationId: application._id,
    profile: profilesByUser.get(application.applicant?._id?.toString()) || {},
  }));
  const result = await runAndStore({
    req,
    type: "candidate_ranking",
    system:
      "Rank applicants against supplied job requirements. Return {rankings:{applicationId:string,score:number,skillsMatch:number,experienceMatch:number,educationMatch:number,reasons:string[]}[]}. Use only supplied application IDs and explain every score.",
    input: JSON.stringify({ job, candidates }),
  });
  return res.status(200).json(result);
};

export const generateHiringInsights = async (req, res) => {
  const [jobs, applications, profiles] = await Promise.all([
    Job.find().select("skills category experience location status createdAt").lean(),
    Application.find().select("status createdAt").lean(),
    Profile.find().select("skills location").lean(),
  ]);
  const result = await runAndStore({
    req,
    type: "hiring_insights",
    system:
      "Analyze aggregate hiring data without inventing facts. Return {trends:string[],popularSkills:{skill:string,count:number}[],candidateSupply:string[],recruiterActivity:string[],recommendations:string[]}.",
    input: JSON.stringify({ jobs, applications, profiles }),
  });
  return res.status(200).json(result);
};
