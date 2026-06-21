import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const RecruiterDashboard = () => {
  const { refreshUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [company, setCompany] = useState({
    name: "",
    recruiterName: "",
    officialEmail: "",
    phone: "",
    website: "",
    linkedinUrl: "",
    location: "",
    companySize: "",
    industry: "",
    description: "",
    designation: "",
    registrationNumber: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/recruiter/dashboard"), api.get("/recruiter/company")])
      .then(([dashboardResponse, companyResponse]) => {
        setStats(dashboardResponse.data.stats);
        if (companyResponse.data.company) {
          setCompany(companyResponse.data.company);
        }
        // Company verification can change in a separate admin session. Refresh
        // the auth snapshot so global navigation reflects the latest status.
        return refreshUser();
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load dashboard")
      )
      .finally(() => setLoading(false));
  }, [refreshUser]);

  const saveCompany = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/recruiter/company", company);
      setCompany(data.company);
      toast.success("Company profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update company");
    } finally {
      setSaving(false);
    }
  };

  const submitForReview = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/recruiter/company/submit");
      setCompany(data.company);
      await refreshUser();
      toast.success("Profile submitted. Admin review usually takes up to 24 hours.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Recruiter dashboard</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Hiring overview</h1>
        </div>
        <Link to="/recruiter/jobs/new" className="rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white">Post a job</Link>
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Active job records</p><p className="mt-2 text-4xl font-bold text-slate-900">{stats?.jobs || 0}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Total applications</p><p className="mt-2 text-4xl font-bold text-slate-900">{stats?.applications || 0}</p></div>
      </div>
      <div className={`mt-7 rounded-2xl border p-5 ${company.verificationStatus === "verified" ? "border-emerald-200 bg-emerald-50" : company.verificationStatus === "rejected" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"}`}>
        <p className="font-semibold capitalize text-slate-900">Verification: {company.verificationStatus || "unverified"}</p>
        <p className="mt-1 text-sm text-slate-600">
          {company.verificationStatus === "verified"
            ? "Your company is verified and can publish jobs."
            : company.verificationStatus === "rejected"
              ? company.verificationNotes || "Update the profile and resubmit for review."
              : "Complete the profile and submit it for admin review before publishing jobs."}
        </p>
      </div>
      <form onSubmit={saveCompany} className="mt-7 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-xl font-bold text-slate-900">Company profile</h2>
          <p className="mt-1 text-sm text-slate-500">Used to keep recruiter information organized.</p>
        </div>
        {[
          ["name", "Company name"],
          ["recruiterName", "Recruiter full name"],
          ["officialEmail", "Official company email"],
          ["phone", "Phone number"],
          ["website", "Website"],
          ["linkedinUrl", "Company LinkedIn"],
          ["location", "Location"],
          ["industry", "Industry"],
          ["designation", "Your designation"],
          ["registrationNumber", "GST / CIN / MSME number (optional)"],
          ["logoUrl", "Logo URL"],
        ].map(([field, label]) => (
          <label key={field} className="text-sm font-medium text-slate-700">
            {label}
            <input
              required={["name", "recruiterName", "officialEmail", "phone", "location", "industry", "designation"].includes(field)}
              type={field.includes("Url") || field === "website" ? "url" : field === "officialEmail" ? "email" : "text"}
              value={company[field] || ""}
              onChange={(event) => setCompany({ ...company, [field]: event.target.value })}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700">
          Company size
          <select required value={company.companySize || ""} onChange={(event) => setCompany({ ...company, companySize: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3">
            <option value="">Select size</option>
            {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => <option key={size}>{size}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Description
          <textarea rows="4" value={company.description || ""} onChange={(event) => setCompany({ ...company, description: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500" />
        </label>
        <div className="flex flex-wrap gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save profile"}</button>
          {company.verificationStatus !== "verified" && company.verificationStatus !== "pending" && (
            <button type="button" onClick={submitForReview} disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-60">Submit for verification</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecruiterDashboard;
