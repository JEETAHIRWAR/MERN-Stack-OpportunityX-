import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/applications")
      .then(({ data }) => setApplications(data))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load applications"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Administration</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">All applications</h1>
      <div className="mt-7 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Job</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Applied</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((application) => (
              <tr key={application._id}>
                <td className="px-5 py-4"><p className="font-semibold text-slate-900">{application.name}</p><p className="text-xs text-slate-500">{application.email}</p></td>
                <td className="px-5 py-4"><p className="font-medium text-slate-800">{application.jobId?.title || "Removed job"}</p><p className="text-xs text-slate-500">{application.jobId?.company}</p></td>
                <td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{application.status || "Applied"}</span></td>
                <td className="px-5 py-4 text-slate-500">{new Date(application.createdAt || application.appliedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p className="p-8 text-center text-slate-500">No applications found.</p>}
      </div>
    </div>
  );
};

export default AdminApplications;
