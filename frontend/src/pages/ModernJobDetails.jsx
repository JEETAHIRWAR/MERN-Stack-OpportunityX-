import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBookmark, FaBriefcase, FaLocationDot, FaRegBookmark, FaShareNodes } from "react-icons/fa6";
import api from "../utils/api";
import { useAuth } from "../auth/auth";
import LoadingDots from "../components/LoadingDots";

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "Not specified";
const descriptionText = (value = "") =>
  value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

const ModernJobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
        api.put(`/jobs/${id}/view`).catch(() => {});
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Job not found");
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id]);

  useEffect(() => {
    if (user?.role !== "candidate") return;

    Promise.all([
      api.get(`/saved-jobs/${id}`),
      api.get(`/applications/check/${id}`),
    ])
      .then(([savedResponse, applicationResponse]) => {
        setSaved(savedResponse.data.saved);
        setHasApplied(applicationResponse.data.hasApplied);
      })
      .catch(() => {});
  }, [id, user]);

  const toggleSave = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/job/${id}` } } });
      return;
    }
    if (!["candidate", "admin"].includes(user.role)) return;

    setSaving(true);
    try {
      if (saved) {
        await api.delete(`/saved-jobs/${id}`);
      } else {
        await api.post(`/saved-jobs/${id}`);
      }
      setSaved((value) => !value);
      toast.success(saved ? "Removed from saved jobs" : "Job saved");
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Unable to update saved job");
    } finally {
      setSaving(false);
    }
  };

  const apply = async () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/job/${id}` } } });
      return;
    }
    if (user.role !== "candidate") {
      toast.info("Only candidate accounts can apply for jobs");
      return;
    }

    setApplying(true);
    try {
      await api.post("/applications", { jobId: id });
      setHasApplied(true);
      toast.success("Application recorded");
      if (job.applyLink) {
        window.open(job.applyLink, "_blank", "noopener,noreferrer");
      }
    } catch (requestError) {
      if (requestError.response?.status === 409) setHasApplied(true);
      toast.error(requestError.response?.data?.message || "Unable to apply");
    } finally {
      setApplying(false);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: job.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Job link copied");
      }
    } catch {
      // The user may cancel the native share dialog; no error toast is needed.
    }
  };

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center"><LoadingDots /></div>;
  }
  if (error || !job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">{error}</h1>
        <Link to="/" className="mt-5 inline-block font-semibold text-indigo-600">Back to jobs</Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                {job.category}
              </span>
              <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{job.title}</h1>
              <p className="mt-3 text-lg font-semibold text-slate-700">{job.company}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={share} className="rounded-xl border border-slate-300 p-3 text-slate-600 hover:bg-slate-50" aria-label="Share job">
                <FaShareNodes />
              </button>
              {(!user || ["candidate", "admin"].includes(user.role)) && (
                <button type="button" onClick={toggleSave} disabled={saving} className="rounded-xl border border-slate-300 p-3 text-indigo-600 hover:bg-indigo-50 disabled:opacity-50" aria-label="Save job">
                  {saved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              )}
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2"><FaLocationDot /> {job.location}</span>
            <span className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2"><FaBriefcase /> {job.experience}</span>
            <span className="rounded-xl bg-slate-100 px-4 py-2">{job.jobType}</span>
          </div>
          <div className="mt-9">
            <h2 className="text-xl font-bold text-slate-900">About the role</h2>
            <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
              {descriptionText(job.description)}
            </p>
          </div>
        </article>

        <aside className="h-fit rounded-3xl bg-slate-900 p-6 text-white shadow-lg lg:sticky lg:top-24">
          <h2 className="text-xl font-bold">Application details</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div><dt className="text-slate-400">Applications open</dt><dd className="mt-1 font-medium">{formatDate(job.applicationStartDate)}</dd></div>
            <div><dt className="text-slate-400">Application deadline</dt><dd className="mt-1 font-medium">{formatDate(job.applicationEndDate)}</dd></div>
            <div><dt className="text-slate-400">Views</dt><dd className="mt-1 font-medium">{job.viewCount || 0}</dd></div>
          </dl>
          <button
            type="button"
            onClick={apply}
            disabled={applying || hasApplied}
            className="mt-7 w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {hasApplied ? "Already applied" : applying ? "Submitting..." : "Apply now"}
          </button>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">
            OpportunityX records your application before opening the employer&apos;s application page.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default ModernJobDetails;
