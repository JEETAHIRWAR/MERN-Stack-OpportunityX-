import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../auth/auth";
import LoadingDots from "../components/LoadingDots";

const initialJob = {
  title: "",
  description: "",
  company: "",
  location: "",
  applyLink: "",
  applicationStartDate: "",
  applicationEndDate: "",
  category: "IT",
  experience: "Fresher",
  jobType: "Work from Home",
  skills: "",
  employmentType: "Full-time",
  status: "Published",
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const JobForm = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(initialJob);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(
    user.verificationStatus || "unverified"
  );
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const base = user.role === "admin" ? "/admin" : "/recruiter";

  useEffect(() => {
    if (!id) return;
    api
      .get(`/jobs/${id}`)
      .then(({ data }) =>
        setJob({
          ...initialJob,
          ...data,
          skills: data.skills?.join(", ") || "",
          applicationStartDate: toDateInput(data.applicationStartDate),
          applicationEndDate: toDateInput(data.applicationEndDate),
        })
      )
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user.role !== "recruiter") return;
    api.get("/recruiter/company")
      .then(({ data }) =>
        setVerificationStatus(data.company?.verificationStatus || "unverified")
      )
      .catch(() => setVerificationStatus(user.verificationStatus || "unverified"));
  }, [user.role, user.verificationStatus]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!job.description.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Job description is required");
      return;
    }
    if (
      user.role === "recruiter" &&
      job.status !== "Draft" &&
      verificationStatus !== "verified"
    ) {
      setShowVerificationNotice(true);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...job,
        skills:
          typeof job.skills === "string"
            ? job.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
            : job.skills,
      };
      if (id) {
        await api.put(`/jobs/${id}`, payload);
        toast.success("Job updated");
      } else {
        await api.post("/jobs", payload);
        toast.success("Job published");
      }
      navigate(`${base}/jobs`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{id ? "Edit listing" : "New listing"}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">{id ? "Update job" : "Post a job"}</h1>
      <p className="mt-2 text-slate-500">Create a focused listing with the details candidates need to make a confident decision.</p>
      {user.role === "recruiter" && verificationStatus !== "verified" && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Your recruiter status is <strong className="capitalize">{verificationStatus}</strong>. You may save a draft, but only verified recruiters can publish jobs.
        </div>
      )}
      <form onSubmit={handleSubmit} className="surface-card mt-7 grid gap-5 p-6 sm:grid-cols-2">
        {[
          ["title", "Job title", "text"],
          ["company", "Company", "text"],
          ["location", "Location", "text"],
          ["applyLink", "External apply URL", "url"],
          ["applicationStartDate", "Application start", "date"],
          ["applicationEndDate", "Application deadline", "date"],
        ].map(([field, label, type]) => (
          <label key={field} className="text-sm font-medium text-slate-700">
            {label}
            <input required={!field.includes("Date")} type={type} value={job[field]} onChange={(event) => setJob({ ...job, [field]: event.target.value })} className="field-control" />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Skills
          <input value={job.skills} onChange={(event) => setJob({ ...job, skills: event.target.value })} placeholder="React, Node.js, MongoDB" className="field-control" />
        </label>
        {[
          ["category", ["IT", "Non-IT"]],
          ["experience", ["Fresher", "Experienced"]],
          ["jobType", ["Work from Home", "In Office"]],
          ["employmentType", ["Full-time", "Part-time", "Contract", "Internship"]],
          ["status", ["Draft", "Published", "Paused", "Closed"]],
        ].map(([field, options]) => (
          <label key={field} className="text-sm font-medium capitalize text-slate-700">
            {field.replace(/([A-Z])/g, " $1")}
            <select value={job[field]} onChange={(event) => setJob({ ...job, [field]: event.target.value })} className="field-control">
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Job description
          <textarea
            rows="12"
            required
            value={job.description}
            onChange={(event) => setJob({ ...job, description: event.target.value })}
            className="field-control"
            placeholder="Describe the role, responsibilities, requirements, and hiring process."
          />
        </label>
        <button type="submit" disabled={submitting} className="primary-button sm:col-span-2 sm:w-fit">
          {submitting ? "Saving..." : id ? "Update job" : "Publish job"}
        </button>
      </form>
      {showVerificationNotice && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="verification-title">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <span className="inline-flex rounded-2xl bg-amber-50 p-4 text-2xl text-amber-600">!</span>
            <h2 id="verification-title" className="mt-5 text-2xl font-bold text-slate-950">Recruiter verification required</h2>
            <p className="mt-3 text-slate-600">
              {verificationStatus === "pending"
                ? "Your recruiter account is under review. You can publish jobs after admin approval."
                : verificationStatus === "rejected"
                  ? "Your verification request was rejected. Review the reason, update your company profile, and resubmit."
                  : "Please complete your recruiter profile first. After submission, admin review usually takes up to 24 hours."}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowVerificationNotice(false)} className="secondary-button">Keep editing</button>
              <button type="button" onClick={() => navigate("/recruiter/company")} className="primary-button">Open company profile</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobForm;
