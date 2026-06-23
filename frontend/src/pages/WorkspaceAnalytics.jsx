import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaBriefcase, FaChartLine, FaFileLines, FaUsers } from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const WorkspaceAnalytics = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [historical, setHistorical] = useState(null);
  const admin = user.role === "admin";

  useEffect(() => {
    Promise.all([
      api.get(admin ? "/admin/dashboard" : "/recruiter/dashboard"),
      api.get(admin ? "/admin/analytics" : "/recruiter/analytics"),
    ])
      .then(([dashboardResponse, analyticsResponse]) => {
        setData(dashboardResponse.data);
        setHistorical(analyticsResponse.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load analytics"));
  }, [admin]);

  if (!data || !historical) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  const stats = admin
    ? [["Users", data.stats.users, FaUsers], ["Jobs", data.stats.jobs, FaBriefcase], ["Applications", data.stats.applications, FaFileLines], ["Applications / job", data.stats.applicationsPerJob, FaChartLine]]
    : [["Jobs", data.stats.jobs, FaBriefcase], ["Applications", data.stats.applications, FaUsers]];
  const breakdown = admin
    ? [["Candidates", data.stats.candidates], ["Recruiters", data.stats.recruiters]]
    : (data.statusBreakdown || []).map((item) => [item._id, item.count]);
  const max = Math.max(...breakdown.map(([, count]) => count), 1);

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Real platform data</p>
      <h1 className="mt-1 text-3xl font-bold">{admin ? "Platform analytics" : "Hiring analytics"}</h1>
      <p className="mt-2 text-slate-500">Current and historical metrics derived from OpportunityX records.</p>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => <div key={label} className="surface-card flex items-center justify-between p-6"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold">{value || 0}</p></div><span className="rounded-2xl bg-indigo-50 p-4 text-indigo-600"><Icon /></span></div>)}
      </div>
      <section className="surface-card mt-6 p-6">
        <h2 className="text-xl font-bold">{admin ? "User distribution" : "Application pipeline"}</h2>
        <div className="mt-6 space-y-4">{breakdown.map(([label, count]) => <div key={label}><div className="flex justify-between text-sm"><span className="font-semibold">{label}</span><span>{count}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(count / max) * 100}%` }} /></div></div>)}</div>
      </section>
      <section className="surface-card mt-6 p-6">
        <h2 className="text-xl font-bold">{admin ? "Six-month activity" : "Performance by job"}</h2>
        {admin ? <div className="mt-5 grid gap-5 lg:grid-cols-3">{Object.entries(historical.series || {}).map(([name, points]) => <div key={name} className="rounded-xl bg-slate-50 p-4"><h3 className="font-bold capitalize">{name}</h3><div className="mt-4 space-y-2">{points.map((point) => <div key={point._id} className="flex justify-between text-sm"><span>{point._id}</span><strong>{point.count}</strong></div>)}</div></div>)}</div>
          : <div className="mt-5 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b border-slate-200 text-slate-500"><th className="py-3">Job</th><th>Views</th><th>Applications</th><th>Conversion</th></tr></thead><tbody>{historical.jobs.map((job) => <tr key={job._id} className="border-b border-slate-100"><td className="py-4 font-semibold">{job.title}</td><td>{job.views}</td><td>{job.applications}</td><td>{job.conversionRate}%</td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
};

export default WorkspaceAnalytics;
