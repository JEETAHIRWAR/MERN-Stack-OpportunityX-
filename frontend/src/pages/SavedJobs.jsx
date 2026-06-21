import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/saved-jobs")
      .then(({ data }) => setJobs(data))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load saved jobs")
      )
      .finally(() => setLoading(false));
  }, []);

  const remove = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setJobs((current) => current.filter((job) => job._id !== jobId));
      toast.success("Removed from saved jobs");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove job");
    }
  };

  if (loading) return <div className="flex min-h-[65vh] items-center justify-center"><LoadingDots /></div>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Saved jobs</h1>
      <p className="mt-2 text-slate-500">Your shortlist of opportunities to revisit.</p>
      {jobs.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FaBookmark className="mx-auto text-4xl text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-800">No saved jobs yet</h2>
          <Link to="/" className="mt-3 inline-block font-semibold text-indigo-600">Browse open roles</Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <article key={job._id} className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                <p className="mt-1 text-slate-600">{job.company} · {job.location}</p>
                <p className="mt-2 text-sm text-slate-500">{job.experience} · {job.jobType}</p>
              </div>
              <div className="flex gap-3">
                <Link to={`/job/${job._id}`} className="rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white">View</Link>
                <button type="button" onClick={() => remove(job._id)} className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-600">Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default SavedJobs;
