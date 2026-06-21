import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const statusColors = {
  Applied: "bg-blue-50 text-blue-700",
  Reviewing: "bg-amber-50 text-amber-700",
  Shortlisted: "bg-violet-50 text-violet-700",
  Interview: "bg-indigo-50 text-indigo-700",
  Rejected: "bg-rose-50 text-rose-700",
  Hired: "bg-emerald-50 text-emerald-700",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then(({ data }) => setApplications(data))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load applications")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-[65vh] items-center justify-center"><LoadingDots /></div>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">My applications</h1>
      <p className="mt-2 text-slate-500">Track progress across every application.</p>
      {applications.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-800">No applications yet</h2>
          <Link to="/" className="mt-3 inline-block font-semibold text-indigo-600">Find your next role</Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {applications.map((application) => (
            <div key={application._id} className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 last:border-0 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-bold text-slate-900">{application.jobId?.title || "Removed job"}</h2>
                <p className="mt-1 text-sm text-slate-500">{application.jobId?.company} · Applied {new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${statusColors[application.status] || "bg-slate-100 text-slate-700"}`}>
                {application.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyApplications;
