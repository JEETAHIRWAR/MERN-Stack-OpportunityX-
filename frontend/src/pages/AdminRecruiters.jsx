import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const AdminRecruiters = () => {
  const [companies, setCompanies] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api
      .get("/admin/recruiters", { params: status ? { status } : {} })
      .then(({ data }) => setCompanies(data))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Unable to load recruiters")
      );
  }, [status]);

  const review = async (company, nextStatus) => {
    const notes = window.prompt(
      nextStatus === "rejected"
        ? "Enter a clear rejection reason"
        : "Optional approval notes",
      ""
    );
    if (notes === null) return;

    try {
      const { data } = await api.patch(
        `/admin/recruiters/${company._id}/review`,
        { status: nextStatus, notes }
      );
      setCompanies((current) =>
        current.map((item) => (item._id === data._id ? data : item))
      );
      toast.success(`Recruiter ${nextStatus}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to review recruiter");
    }
  };

  if (!companies) {
    return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Trust & verification</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Recruiters</h1>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-300 bg-white px-4 py-3">
          <option value="">All statuses</option>
          {["unverified", "pending", "verified", "rejected"].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="mt-7 space-y-4">
        {companies.map((company) => (
          <article key={company._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 lg:flex-row">
              <div>
                <h2 className="text-xl font-bold text-slate-950">{company.name}</h2>
                <p className="mt-1 text-sm text-slate-600">{company.recruiterName} · {company.officialEmail}</p>
                <p className="mt-3 text-sm text-slate-500">{company.industry} · {company.companySize} · {company.location}</p>
                <p className="mt-3 max-w-2xl text-sm text-slate-600">{company.description}</p>
                <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize">{company.verificationStatus}</span>
              </div>
              <div className="flex h-fit gap-2">
                <button type="button" onClick={() => review(company, "verified")} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white">Approve</button>
                <button type="button" onClick={() => review(company, "rejected")} className="rounded-xl bg-rose-600 px-4 py-2 font-semibold text-white">Reject</button>
              </div>
            </div>
          </article>
        ))}
        {companies.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">No recruiters match this filter.</div>}
      </div>
    </div>
  );
};

export default AdminRecruiters;
