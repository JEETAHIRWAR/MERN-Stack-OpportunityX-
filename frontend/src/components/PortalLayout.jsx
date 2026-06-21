import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

const PortalLayout = ({ role }) => {
  const { user } = useAuth();
  const links =
    role === "admin"
      ? [
          ["Dashboard", "/admin/dashboard"],
          ["Jobs", "/admin/jobs"],
          ["Recruiters", "/admin/recruiters"],
          ["Users", "/admin/users"],
          ["Applications", "/admin/applications"],
        ]
      : [
          ["Dashboard", "/recruiter/dashboard"],
          ["My jobs", "/recruiter/jobs"],
          ["Post a job", "/recruiter/jobs/new"],
          ["Recruiter profile", "/recruiter/dashboard"],
        ];

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[230px_1fr]">
      <aside className="h-fit rounded-2xl bg-slate-900 p-4 shadow-lg md:sticky md:top-24">
        <p className="px-3 text-xs font-semibold uppercase tracking-widest text-indigo-300">
          {role} workspace
        </p>
        <p className="mb-5 px-3 pt-2 text-sm text-slate-400">
          Signed in as {user?.username}
        </p>
        <nav className="space-y-1">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
};

export default PortalLayout;
