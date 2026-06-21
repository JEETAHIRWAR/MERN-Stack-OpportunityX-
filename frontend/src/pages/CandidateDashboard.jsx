import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/profile/dashboard")
      .then((response) => setData(response.data))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load dashboard")
      );
  }, []);

  if (!data) return <div className="flex min-h-[60vh] items-center justify-center"><LoadingDots /></div>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Candidate workspace</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-950">Your opportunity dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link to="/saved-jobs" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Saved jobs</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{data.savedCount}</p>
        </Link>
        <Link to="/my-applications" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Recent applications</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{data.recentApplications.length}</p>
        </Link>
        <Link to="/profile" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Profile completion</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{data.profileCompletion}%</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${data.profileCompletion}%` }} /></div>
        </Link>
      </div>
      <section className="mt-10">
        <div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Based on your profile</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Recommended jobs</h2></div><Link to="/" className="font-semibold text-indigo-600">Browse all</Link></div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.recommendedJobs.map((job) => (
            <Link key={job._id} to={`/job/${job._id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="font-bold text-slate-950">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{job.company} · {job.location}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default CandidateDashboard;
