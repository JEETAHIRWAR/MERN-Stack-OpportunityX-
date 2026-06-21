import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const statuses = ["Applied", "Reviewing", "Shortlisted", "Interview", "Rejected", "Hired"];

const ManageApplicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    api
      .get(`/applications/job/${jobId}`)
      .then(({ data }) =>
        setApplications(
          data.map((application) => ({
            ...application,
            status: application.status || "Applied",
          }))
        )
      )
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load applicants"))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateLocal = (id, field, value) =>
    setApplications((current) => current.map((application) => application._id === id ? { ...application, [field]: value } : application));

  const save = async (application) => {
    setSavingId(application._id);
    try {
      const { data } = await api.patch(`/applications/${application._id}`, {
        status: application.status,
        recruiterNotes: application.recruiterNotes,
      });
      updateLocal(application._id, "status", data.status);
      toast.success("Application updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update application");
    } finally {
      setSavingId("");
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Applicant management</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">Applicants</h1>
      {applications.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No applications for this job yet.</div>
      ) : (
        <div className="mt-7 space-y-4">
          {applications.map((application) => (
            <article key={application._id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_180px]">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{application.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{application.email}</p>
                  <textarea rows="3" value={application.recruiterNotes || ""} onChange={(event) => updateLocal(application._id, "recruiterNotes", event.target.value)} placeholder="Private recruiter notes" className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-3">
                  <select value={application.status} onChange={(event) => updateLocal(application._id, "status", event.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5">
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <button type="button" onClick={() => save(application)} disabled={savingId === application._id} className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-semibold text-white disabled:opacity-60">
                    {savingId === application._id ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageApplicants;
