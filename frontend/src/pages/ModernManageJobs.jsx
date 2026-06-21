import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const ModernManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const base = user.role === "admin" ? "/admin" : "/recruiter";

  useEffect(() => {
    api
      .get("/jobs/managed")
      .then(({ data }) => setJobs(data))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job and its applications?")) return;
    setDeletingId(jobId);
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((current) => current.filter((job) => job._id !== jobId));
      toast.success("Job deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete job");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Job management</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{user.role === "admin" ? "All jobs" : "My jobs"}</h1></div>
        <Link to={`${base}/jobs/new`} className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white">Post a job</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No jobs to manage yet.</div>
      ) : (
        <div className="mt-7 space-y-4">
          {jobs.map((job) => (
            <article key={job._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                  <p className="mt-1 text-slate-600">{job.company} · {job.location}</p>
                  <p className="mt-2 text-sm text-slate-500">{job.viewCount || 0} views · Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`${base}/jobs/${job._id}/edit`} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700">Edit</Link>
                  <Link to={`${base}/applicants/${job._id}`} className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 font-semibold text-indigo-700">Applicants</Link>
                  <button type="button" onClick={() => deleteJob(job._id)} disabled={deletingId === job._id} className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    {deletingId === job._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernManageJobs;
