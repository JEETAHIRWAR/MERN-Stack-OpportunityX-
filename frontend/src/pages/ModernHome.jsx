import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBriefcase,
  FaLocationDot,
  FaMagnifyingGlass,
  FaSliders,
} from "react-icons/fa6";
import api from "../utils/api";
import LoadingDots from "../components/LoadingDots";

const initialFilters = {
  search: "",
  location: "",
  experience: "",
  jobType: "",
};

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(value))
    : "Open until filled";

const ModernHome = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchJobs = async (activeFilters = filters, page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, value]) => value)
      );
      params.page = page;
      params.limit = 12;
      const { data } = await api.get("/jobs", { params });
      setJobs(data.jobs || data);
      if (data.pagination) setPagination(data.pagination);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Jobs could not be loaded. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(initialFilters);
    // The initial request intentionally uses fixed empty filters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    fetchJobs(initialFilters);
  };

  return (
    <>
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
            Find work that moves you forward
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Search focused opportunities from trusted recruiters.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Explore roles, save the ones that fit, and track every application
            from one place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="-mt-20 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10"
        >
          <div className="grid gap-2 lg:grid-cols-[minmax(260px,1.5fr)_minmax(190px,1fr)_170px_170px_auto]">
            <label className="group relative">
              <span className="sr-only">Keyword</span>
              <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
              <input
                value={filters.search}
                onChange={(event) =>
                  setFilters({ ...filters, search: event.target.value })
                }
                placeholder="Job title, skill or company"
                className="h-14 w-full rounded-2xl border border-transparent bg-slate-50 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="group relative">
              <span className="sr-only">Location</span>
              <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
              <input
                value={filters.location}
                onChange={(event) =>
                  setFilters({ ...filters, location: event.target.value })
                }
                placeholder="City or remote"
                className="h-14 w-full rounded-2xl border border-transparent bg-slate-50 pl-11 pr-4 text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Job type</span>
              <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filters.jobType}
                onChange={(event) =>
                  setFilters({ ...filters, jobType: event.target.value })
                }
                className="h-14 w-full appearance-none rounded-2xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Job type</option>
                <option value="Work from Home">Remote</option>
                <option value="In Office">In office</option>
              </select>
            </label>
            <label className="relative">
              <span className="sr-only">Experience</span>
              <FaSliders className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={filters.experience}
                onChange={(event) =>
                  setFilters({ ...filters, experience: event.target.value })
                }
                className="h-14 w-full appearance-none rounded-2xl border border-transparent bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="Experienced">Experienced</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="h-14 rounded-2xl bg-indigo-600 px-6 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Searching..." : "Search jobs"}
            </button>
          </div>
          <div className="flex items-center justify-between px-2 pb-1 pt-3">
            <p className="text-xs text-slate-500">
              Search across verified recruiter opportunities.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-slate-500 transition hover:text-indigo-600 focus:outline-none focus:underline"
            >
              Reset search
            </button>
          </div>
        </form>

        <div className="mt-10 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Current openings
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "Searching..." : `${jobs.length} opportunities`}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center">
            <LoadingDots />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => fetchJobs()}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 font-semibold text-white"
            >
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FaBriefcase className="mx-auto text-4xl text-slate-300" />
            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              No matching jobs
            </h3>
            <p className="mt-2 text-slate-500">
              Clear a filter or try a broader search.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {job.category}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(job.applicationEndDate)}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {job.title}
                </h3>
                <p className="mt-2 font-medium text-slate-700">{job.company}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <FaLocationDot /> {job.location}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                    {job.experience}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1.5">
                    {job.jobType}
                  </span>
                </div>
                <Link
                  to={`/job/${job._id}`}
                  className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 font-semibold text-indigo-600"
                >
                  View opportunity
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </Link>
              </article>
            ))}
          </div>
        )}
        {!loading && !error && pagination.pages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Job result pages">
            <button type="button" disabled={pagination.page === 1} onClick={() => fetchJobs(filters, pagination.page - 1)} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:opacity-40">Previous</button>
            <span className="text-sm text-slate-500">Page {pagination.page} of {pagination.pages}</span>
            <button type="button" disabled={pagination.page === pagination.pages} onClick={() => fetchJobs(filters, pagination.page + 1)} className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 disabled:opacity-40">Next</button>
          </nav>
        )}
      </main>
    </>
  );
};

export default ModernHome;
