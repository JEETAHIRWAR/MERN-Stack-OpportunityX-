import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowRight,
  FaBookmark,
  FaBriefcase,
  FaUserCheck,
} from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const CandidateDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/profile/dashboard")
      .then((response) => setData(response.data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load dashboard"));
  }, []);

  if (!data) return <div className="flex min-h-[60vh] items-center justify-center"><LoadingDots /></div>;

  const cards = [
    ["Saved jobs", data.savedCount, "/saved-jobs", FaBookmark, "bg-indigo-50 text-indigo-600"],
    ["Recent applications", data.recentApplications.length, "/my-applications", FaBriefcase, "bg-violet-50 text-violet-600"],
    ["Profile completion", `${data.profileCompletion}%`, "/profile", FaUserCheck, "bg-emerald-50 text-emerald-600"],
  ];

  return (
    <main>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Candidate workspace</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-950">Your opportunity dashboard</h1>
      <p className="mt-2 text-slate-500">Keep your profile ready and stay on top of every application.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {cards.map(([label, value, path, Icon, tone]) => (
          <Link key={label} to={path} className="surface-card p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-4xl font-bold text-slate-950">{value}</p></div>
              <span className={`rounded-2xl p-4 ${tone}`}><Icon /></span>
            </div>
            {label === "Profile completion" && <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${data.profileCompletion}%` }} /></div>}
          </Link>
        ))}
      </div>
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Based on your profile</p><h2 className="mt-1 text-2xl font-bold text-slate-950">Recommended jobs</h2></div>
          <Link to="/" className="font-semibold text-indigo-600">Browse all</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.recommendedJobs.map((job) => (
            <Link key={job._id} to={`/job/${job._id}`} className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <h3 className="font-bold text-slate-950">{job.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{job.company} · {job.location}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">View role <FaArrowRight className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
          {data.recommendedJobs.length === 0 && <div className="surface-card border-dashed p-8 text-center text-slate-500 md:col-span-2 lg:col-span-3">Complete your skills to unlock more relevant recommendations.</div>}
        </div>
      </section>
    </main>
  );
};

export default CandidateDashboard;
