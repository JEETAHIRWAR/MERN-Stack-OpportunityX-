import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const AdminReports = () => {
  const [report, setReport] = useState(null);
  useEffect(() => {
    api.get("/admin/reports/summary")
      .then(({ data }) => setReport(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load report"));
  }, []);
  if (!report) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;
  const sections = [["Users by role", report.usersByRole], ["Jobs by status", report.jobsByStatus], ["Applications by status", report.applicationsByStatus], ["Recruiters by verification", report.recruitersByStatus]];
  return <div><h1 className="text-3xl font-bold">Platform reports</h1><p className="mt-2 text-slate-500">Generated {new Date(report.generatedAt).toLocaleString()}</p><div className="mt-7 grid gap-5 md:grid-cols-2">{sections.map(([title, rows]) => <section key={title} className="surface-card p-6"><h2 className="text-xl font-bold">{title}</h2><div className="mt-5 space-y-3">{rows.map((row) => <div key={row._id || "unknown"} className="flex justify-between rounded-xl bg-slate-50 p-4"><span className="capitalize">{row._id || "Unknown"}</span><strong>{row.count}</strong></div>)}</div></section>)}</div></div>;
};
export default AdminReports;
