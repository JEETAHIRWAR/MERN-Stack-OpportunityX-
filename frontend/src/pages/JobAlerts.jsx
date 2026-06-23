import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const empty = { name: "", keyword: "", location: "", jobType: "", experience: "", frequency: "daily" };

const JobAlerts = () => {
  const [alerts, setAlerts] = useState(null);
  const [form, setForm] = useState(empty);
  const load = () => api.get("/job-alerts").then(({ data }) => setAlerts(data));
  useEffect(() => { load().catch((error) => toast.error(error.response?.data?.message || "Unable to load alerts")); }, []);

  const create = async (event) => {
    event.preventDefault();
    try {
      await api.post("/job-alerts", form);
      setForm(empty);
      await load();
      toast.success("Job alert created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create alert");
    }
  };

  const remove = async (id) => {
    await api.delete(`/job-alerts/${id}`);
    setAlerts((current) => current.filter((alert) => alert._id !== id));
    toast.success("Job alert deleted");
  };

  if (!alerts) return <div className="surface-card h-72 animate-pulse" />;
  return (
    <div>
      <h1 className="text-3xl font-bold">Job alerts</h1>
      <p className="mt-2 text-slate-500">Save focused searches for scheduled opportunity matching.</p>
      <form onSubmit={create} className="surface-card mt-7 grid gap-4 p-6 sm:grid-cols-2">
        {[["name", "Alert name"], ["keyword", "Keyword"], ["location", "Location"]].map(([field, label]) => <label key={field} className="text-sm font-semibold">{label}<input required={field === "name"} value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="field-control" /></label>)}
        <label className="text-sm font-semibold">Frequency<select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })} className="field-control"><option>instant</option><option>daily</option><option>weekly</option></select></label>
        <button className="primary-button sm:col-span-2 sm:w-fit">Create alert</button>
      </form>
      <div className="mt-6 space-y-3">
        {alerts.map((alert) => <article key={alert._id} className="surface-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"><div><h2 className="font-bold">{alert.name}</h2><p className="mt-1 text-sm text-slate-500">{[alert.keyword, alert.location, alert.frequency].filter(Boolean).join(" · ")}</p></div><button type="button" onClick={() => remove(alert._id)} className="secondary-button">Delete</button></article>)}
        {!alerts.length && <div className="surface-card border-dashed p-10 text-center text-slate-500">No job alerts yet.</div>}
      </div>
    </div>
  );
};

export default JobAlerts;
