import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quillStyles.css";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!job.description.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Job description is required");
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
      <form onSubmit={handleSubmit} className="mt-7 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
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
            <input required={!field.includes("Date")} type={type} value={job[field]} onChange={(event) => setJob({ ...job, [field]: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Skills
          <input value={job.skills} onChange={(event) => setJob({ ...job, skills: event.target.value })} placeholder="React, Node.js, MongoDB" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
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
            <select value={job[field]} onChange={(event) => setJob({ ...job, [field]: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500">
              {options.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Job description
          <ReactQuill value={job.description} onChange={(description) => setJob({ ...job, description })} className="mt-2 rounded-xl bg-white" />
        </label>
        <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">
          {submitting ? "Saving..." : id ? "Update job" : "Publish job"}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
