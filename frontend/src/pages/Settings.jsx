import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const Settings = () => {
  const [preferences, setPreferences] = useState(null);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/preferences")
      .then(({ data }) => setPreferences({
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
        jobAlerts: true,
        messageNotifications: true,
        marketingEmails: false,
        ...data.preferences,
      }))
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load settings"));
  }, []);

  const savePreferences = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/preferences", preferences);
      setPreferences(data.preferences);
      toast.success("Preferences updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await api.patch("/auth/password", password);
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update password");
    } finally {
      setSaving(false);
    }
  };

  if (!preferences) return <div className="surface-card h-72 animate-pulse" />;

  return (
    <div className="max-w-5xl">
      <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Account</p>
      <h1 className="mt-1 text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-slate-500">Manage security, appearance, and notification preferences.</p>
      <form onSubmit={changePassword} className="surface-card mt-7 grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2"><h2 className="text-xl font-bold">Change password</h2><p className="mt-1 text-sm text-slate-500">Confirm your current password before choosing a new one.</p></div>
        <label className="text-sm font-semibold sm:col-span-2">Current password<input type="password" required value={password.currentPassword} onChange={(event) => setPassword({ ...password, currentPassword: event.target.value })} className="field-control" /></label>
        <label className="text-sm font-semibold">New password<input type="password" minLength="8" required value={password.newPassword} onChange={(event) => setPassword({ ...password, newPassword: event.target.value })} className="field-control" /></label>
        <label className="text-sm font-semibold">Confirm password<input type="password" minLength="8" required value={password.confirmPassword} onChange={(event) => setPassword({ ...password, confirmPassword: event.target.value })} className="field-control" /></label>
        <button disabled={saving} className="primary-button sm:col-span-2 sm:w-fit">Update password</button>
      </form>
      <section className="surface-card mt-6 p-6">
        <h2 className="text-xl font-bold">Preferences</h2>
        <label className="mt-5 block text-sm font-semibold">Appearance<select value={preferences.theme} onChange={(event) => setPreferences({ ...preferences, theme: event.target.value })} className="field-control"><option value="system">Use system setting</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
        <div className="mt-6 space-y-4">
          {[["emailNotifications", "Email notifications"], ["pushNotifications", "Push notifications"], ["jobAlerts", "Job alerts"], ["messageNotifications", "Messages"], ["marketingEmails", "Product updates"]].map(([field, label]) => (
            <label key={field} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><span className="font-semibold">{label}</span><input type="checkbox" checked={Boolean(preferences[field])} onChange={(event) => setPreferences({ ...preferences, [field]: event.target.checked })} className="h-5 w-5 accent-indigo-600" /></label>
          ))}
        </div>
        <button type="button" onClick={savePreferences} disabled={saving} className="primary-button mt-6">Save preferences</button>
      </section>
    </div>
  );
};

export default Settings;
