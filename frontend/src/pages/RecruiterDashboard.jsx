import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowRight,
  FaBriefcase,
  FaCircleCheck,
  FaClock,
  FaFileCircleCheck,
  FaUserGroup,
} from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";
import { useAuth } from "../auth/auth";

const RecruiterDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    Promise.all([api.get("/recruiter/dashboard"), api.get("/recruiter/company")])
      .then(([dashboardResponse, companyResponse]) => {
        setData(dashboardResponse.data);
        setCompany(companyResponse.data.company);
        return refreshUser();
      })
      .catch((error) => toast.error(error.response?.data?.message || "Unable to load dashboard"));
  }, [refreshUser]);

  if (!data) return <div className="flex min-h-96 items-center justify-center"><LoadingDots /></div>;

  const status = company?.verificationStatus || "unverified";
  const statCards = [
    ["Active jobs", data.stats?.jobs || 0, FaBriefcase],
    ["Total applicants", data.stats?.applications || 0, FaUserGroup],
    ["Shortlisted", data.statusBreakdown?.find((item) => item._id === "Shortlisted")?.count || 0, FaFileCircleCheck],
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Hiring workspace</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950">Welcome back, {user?.username}</h1>
          <p className="mt-2 text-slate-500">Manage your job postings and move candidates through the hiring process.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="primary-button">Post a job <FaArrowRight /></Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {statCards.map(([label, value, Icon]) => (
          <div key={label} className="surface-card flex items-center justify-between p-6">
            <div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-950">{value}</p></div>
            <span className="rounded-2xl bg-indigo-50 p-4 text-xl text-indigo-600"><Icon /></span>
          </div>
        ))}
      </div>
      <section className={`mt-7 rounded-2xl border p-6 ${status === "verified" ? "border-emerald-200 bg-emerald-50" : status === "rejected" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"}`}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            {status === "verified" ? <FaCircleCheck className="mt-1 text-emerald-600" /> : <FaClock className="mt-1 text-amber-600" />}
            <div>
              <h2 className="font-bold capitalize text-slate-950">Recruiter verification: {status}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {status === "verified" ? "Your hiring identity is verified. You can publish and manage jobs." : status === "pending" ? "Your company profile is under admin review." : status === "rejected" ? company?.verificationNotes || "Update your company profile and resubmit it." : "Complete your company profile before publishing jobs."}
              </p>
            </div>
          </div>
          <Link to="/recruiter/company" className="secondary-button whitespace-nowrap">{status === "verified" ? "View company profile" : "Complete profile"}</Link>
        </div>
      </section>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <Link to="/recruiter/jobs" className="surface-card group p-6 transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-semibold text-indigo-600">Job operations</p>
          <h2 className="mt-2 text-xl font-bold">Manage active listings</h2>
          <p className="mt-2 text-sm text-slate-500">Edit job details, review performance, and open applicant pipelines.</p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600">Open jobs <FaArrowRight className="transition group-hover:translate-x-1" /></span>
        </Link>
        <Link to="/recruiter/company" className="surface-card group p-6 transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-semibold text-indigo-600">Trust profile</p>
          <h2 className="mt-2 text-xl font-bold">Maintain company details</h2>
          <p className="mt-2 text-sm text-slate-500">Keep your recruiter identity accurate for candidates and admin review.</p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-indigo-600">Company profile <FaArrowRight className="transition group-hover:translate-x-1" /></span>
        </Link>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
