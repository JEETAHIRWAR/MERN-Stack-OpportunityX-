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
    api.get("/jobs/managed")
      .then(({ data }) => setJobs(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load jobs"))
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

  const moderate = async (job, status) => {
    const reason = status === "approved" ? "" : window.prompt(`Reason for ${status}`, "");
    if (reason === null || (status !== "approved" && !reason.trim())) return;
    try {
      const { data } = await api.patch(`/admin/jobs/${job._id}/moderation`, { status, reason });
      setJobs((current) => current.map((item) => item._id === data._id ? data : item));
      toast.success(`Job marked ${status}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to moderate job");
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Job management</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{user.role === "admin" ? "Job moderation" : "My jobs"}</h1></div>
        <Link to={`${base}/jobs/new`} className="primary-button">Post a job</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No jobs to manage yet.</div>
      ) : (
        <div className="mt-7 space-y-4">
          {jobs.map((job) => (
            <article key={job._id} className="surface-card p-5">
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{job.title}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">{job.moderationStatus || "approved"}</span></div>
                  <p className="mt-1 text-slate-600">{job.company} · {job.location}</p>
                  <p className="mt-2 text-sm text-slate-500">{job.viewCount || 0} views · {job.status} · Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                  {job.moderationReason && <p className="mt-2 text-xs font-semibold text-rose-600">{job.moderationReason}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link to={`${base}/jobs/${job._id}/edit`} className="secondary-button !px-4 !py-2">Edit</Link>
                  <Link to={`${base}/applicants/${job._id}`} className="secondary-button !border-indigo-200 !bg-indigo-50 !px-4 !py-2 !text-indigo-700">Applicants</Link>
                  {user.role === "admin" && <>
                    <button type="button" onClick={() => moderate(job, "approved")} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Approve</button>
                    <button type="button" onClick={() => moderate(job, "flagged")} className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white">Flag</button>
                    <button type="button" onClick={() => moderate(job, "rejected")} className="rounded-lg bg-rose-50 px-4 py-2 font-semibold text-rose-700">Reject</button>
                  </>}
                  <button type="button" onClick={() => deleteJob(job._id)} disabled={deletingId === job._id} className="rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white disabled:opacity-60">{deletingId === job._id ? "Deleting..." : "Delete"}</button>
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
