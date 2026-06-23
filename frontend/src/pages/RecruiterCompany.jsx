import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaCircleCheck,
  FaClock,
  FaPaperPlane,
} from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const emptyCompany = {
  name: "", recruiterName: "", officialEmail: "", phone: "", website: "",
  linkedinUrl: "", location: "", companySize: "", industry: "",
  description: "", designation: "", registrationNumber: "", logoUrl: "",
};

const requiredFields = [
  "name", "recruiterName", "officialEmail", "phone", "location",
  "companySize", "industry", "description", "designation",
];

const RecruiterCompany = () => {
  const { refreshUser } = useAuth();
  const [company, setCompany] = useState(emptyCompany);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    api.get("/recruiter/company")
      .then(({ data }) => data.company && setCompany({ ...emptyCompany, ...data.company }))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load company profile"))
      .finally(() => setLoading(false));
  }, []);

  const completion = useMemo(() => {
    const completed = requiredFields.filter((field) => company[field]).length + (company.website || company.linkedinUrl ? 1 : 0);
    return Math.round((completed / (requiredFields.length + 1)) * 100);
  }, [company]);

  const save = async (event) => {
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

  const submit = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/recruiter/company/submit");
      setCompany(data.company);
      await refreshUser();
      toast.success("Verification request submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to submit profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setUploadingLogo(true);
    try {
      const { data } = await api.post("/uploads/company-logo", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCompany(data.company);
      toast.success("Company logo uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  const statusTone = company.verificationStatus === "verified"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
    : company.verificationStatus === "rejected"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Recruiter identity</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Company profile</h1>
          <p className="mt-2 text-slate-500">Complete your hiring identity and submit it for admin verification.</p>
        </div>
        <div className="min-w-44">
          <div className="flex justify-between text-xs font-semibold text-slate-500"><span>Profile completion</span><span>{completion}%</span></div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-indigo-600" style={{ width: `${completion}%` }} /></div>
        </div>
      </div>

      <div className={`mt-7 flex items-start gap-3 rounded-2xl border p-5 ${statusTone}`}>
        {company.verificationStatus === "verified" ? <FaCircleCheck className="mt-1" /> : <FaClock className="mt-1" />}
        <div>
          <p className="font-bold capitalize">{company.verificationStatus || "unverified"} recruiter</p>
          <p className="mt-1 text-sm">
            {company.verificationStatus === "verified"
              ? "Your company is verified and may publish jobs."
              : company.verificationStatus === "pending"
                ? "Your profile is under review. Admin review usually takes up to 24 hours."
                : company.verificationStatus === "rejected"
                  ? company.verificationNotes || "Update the requested details and submit again."
                  : "Complete all required fields before requesting verification."}
          </p>
        </div>
      </div>

      <form onSubmit={save} className="mt-7 space-y-6">
        <section className="surface-card p-6">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><FaBuilding /></span><div><h2 className="text-xl font-bold">Company and recruiter details</h2><p className="text-sm text-slate-500">Fields marked required are reviewed by the admin team.</p></div></div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-700 sm:col-span-2">
              Company logo
              <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={uploadLogo} disabled={uploadingLogo} className="mt-3 block w-full text-sm font-normal" />
              <span className="mt-2 block text-xs font-normal text-slate-500">{uploadingLogo ? "Uploading..." : "PNG, JPG, WebP, or SVG up to 5 MB."}</span>
            </label>
            {[
              ["name", "Company name", "text"], ["recruiterName", "Recruiter full name", "text"],
              ["officialEmail", "Official company email", "email"], ["phone", "Phone number", "text"],
              ["website", "Company website", "url"], ["linkedinUrl", "Company LinkedIn", "url"],
              ["location", "Company location", "text"], ["industry", "Industry", "text"],
              ["designation", "Recruiter designation", "text"], ["registrationNumber", "GST / CIN / MSME (optional)", "text"],
              ["logoUrl", "Company logo URL (optional)", "url"],
            ].map(([field, label, type]) => (
              <label key={field} className="text-sm font-semibold text-slate-700">
                {label}
                <input required={requiredFields.includes(field)} type={type} value={company[field] || ""} onChange={(event) => setCompany({ ...company, [field]: event.target.value })} className="field-control" />
              </label>
            ))}
            <label className="text-sm font-semibold text-slate-700">
              Company size
              <select required value={company.companySize || ""} onChange={(event) => setCompany({ ...company, companySize: event.target.value })} className="field-control">
                <option value="">Select company size</option>
                {["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => <option key={size}>{size}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Company description
              <textarea required rows="5" value={company.description || ""} onChange={(event) => setCompany({ ...company, description: event.target.value })} className="field-control" placeholder="Describe your company, team, and hiring mission." />
            </label>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="secondary-button">{saving ? "Saving..." : "Save profile"}</button>
          {!["verified", "pending"].includes(company.verificationStatus) && (
            <button type="button" onClick={submit} disabled={saving || completion < 100} className="primary-button"><FaPaperPlane /> Submit for verification</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecruiterCompany;
