import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => setStats(data.stats))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load dashboard")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;
  }

  const cards = [
    ["Users", stats?.users || 0, "/admin/users"],
    ["Candidates", stats?.candidates || 0, "/admin/users"],
    ["Recruiters", stats?.recruiters || 0, "/admin/users"],
    ["Jobs", stats?.jobs || 0, "/admin/jobs"],
    ["Applications", stats?.applications || 0, "/admin/applications"],
    ["Applications / job", stats?.applicationsPerJob || 0, "/admin/applications"],
  ];

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Platform administration</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Dashboard overview</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, link]) => (
          <Link key={label} to={link} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
