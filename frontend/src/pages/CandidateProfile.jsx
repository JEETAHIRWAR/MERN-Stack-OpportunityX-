import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const emptyProfile = {
  name: "",
  phone: "",
  location: "",
  skills: "",
  education: "",
  experience: "",
  resumeUrl: "",
  bio: "",
};

const CandidateProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api
      .get("/profile/me")
      .then(({ data }) => {
        setProfile({
          ...emptyProfile,
          ...data.profile,
          skills: data.profile.skills?.join(", ") || "",
        });
      })
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load profile")
      )
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, value) =>
    setProfile((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/profile/me", profile);
      setProfile({
        ...emptyProfile,
        ...data.profile,
        skills: data.profile.skills?.join(", ") || "",
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    setUploading(true);
    try {
      const { data } = await api.post("/uploads/resume", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateField("resumeUrl", data.url);
      toast.success("Resume uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to upload resume");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[65vh] items-center justify-center"><LoadingDots /></div>;
  }

  return (
    <main className="max-w-5xl">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Candidate profile</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          Welcome, {user?.username}
        </h1>
        <p className="mt-2 text-slate-500">
          Keep your information current so applications use accurate details.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="surface-card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
        <label className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-700 sm:col-span-2">
          Resume upload
          <input type="file" accept=".pdf,.doc,.docx" onChange={uploadResume} disabled={uploading} className="mt-3 block w-full text-sm font-normal" />
          <span className="mt-2 block text-xs font-normal text-slate-500">{uploading ? "Uploading..." : "PDF, DOC, or DOCX up to 10 MB. Requires configured managed storage."}</span>
        </label>
        {[
          ["name", "Full name"],
          ["phone", "Phone"],
          ["location", "Location"],
          ["resumeUrl", "Resume URL"],
        ].map(([field, label]) => (
          <label key={field} className="text-sm font-medium text-slate-700">
            {label}
            <input
              type={field === "resumeUrl" ? "url" : "text"}
              value={profile[field]}
              onChange={(event) => updateField(field, event.target.value)}
              className="field-control"
            />
          </label>
        ))}
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">
          Skills
          <input
            value={profile.skills}
            onChange={(event) => updateField("skills", event.target.value)}
            placeholder="React, Node.js, MongoDB"
            className="field-control"
          />
          <span className="mt-1 block text-xs text-slate-500">Separate skills with commas.</span>
        </label>
        {[
          ["education", "Education"],
          ["experience", "Experience"],
          ["bio", "Professional bio"],
        ].map(([field, label]) => (
          <label key={field} className="text-sm font-medium text-slate-700 sm:col-span-2">
            {label}
            <textarea
              rows={field === "bio" ? 4 : 3}
              value={profile[field]}
              onChange={(event) => updateField(field, event.target.value)}
              className="field-control"
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="primary-button sm:col-span-2 sm:w-fit"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </main>
  );
};

export default CandidateProfile;
