import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBookmark,
  FaBriefcase,
  FaBuilding,
  FaFileLines,
  FaGaugeHigh,
  FaChartLine,
  FaComments,
  FaGear,
  FaRobot,
  FaChartPie,
  FaRightFromBracket,
  FaUser,
  FaUserGroup,
  FaUsers,
} from "react-icons/fa6";
import { useAuth } from "../auth/auth";

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
  }`;

const PortalLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = role === "admin"
    ? [
        ["Dashboard", "/admin/dashboard", FaGaugeHigh],
        ["Users", "/admin/users", FaUsers],
        ["Recruiter approvals", "/admin/recruiters", FaUserGroup],
          ["Job moderation", "/admin/jobs", FaBriefcase],
          ["Applications", "/admin/applications", FaFileLines],
          ["Analytics", "/admin/analytics", FaChartLine],
          ["Reports", "/admin/reports", FaChartPie],
          ["Settings", "/admin/settings", FaGear],
      ]
    : role === "candidate"
      ? [
          ["Dashboard", "/candidate/dashboard", FaGaugeHigh],
          ["Profile", "/profile", FaUser],
          ["Saved jobs", "/saved-jobs", FaBookmark],
          ["Applications", "/my-applications", FaFileLines],
          ["Job alerts", "/candidate/job-alerts", FaBell],
          ["AI recommendations", "/candidate/recommendations", FaRobot],
          ["Messages", "/candidate/messages", FaComments],
          ["Notifications", "/candidate/notifications", FaBell],
          ["Settings", "/candidate/settings", FaGear],
        ]
      : [
        ["Dashboard", "/recruiter/dashboard", FaGaugeHigh],
        ["Post a job", "/recruiter/jobs/new", FaBriefcase],
        ["Manage jobs", "/recruiter/jobs", FaFileLines],
        ["Company profile", "/recruiter/company", FaBuilding],
        ["Analytics", "/recruiter/analytics", FaChartLine],
        ["AI copilot", "/recruiter/copilot", FaRobot],
        ["Messages", "/recruiter/messages", FaComments],
        ["Notifications", "/recruiter/notifications", FaBell],
        ["Settings", "/recruiter/settings", FaGear],
      ];

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1600px] md:grid-cols-[260px_1fr]">
      <aside className="border-r border-slate-200 bg-white p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
        <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">{role} workspace</p>
        <p className="mb-6 px-3 pt-2 text-sm text-slate-500">Signed in as {user?.username}</p>
        <nav className="space-y-1">
          {links.map(([label, path, Icon]) => (
            <NavLink key={path} to={path} className={linkClass}>
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <FaBell className="text-indigo-600" />
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-900">{user?.email}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role}</p>
            </div>
          </div>
          <button type="button" onClick={() => { logout(); navigate("/"); }} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
            <FaRightFromBracket /> Logout
          </button>
        </div>
      </aside>
      <section className="min-w-0 bg-slate-50 px-4 py-8 sm:px-6 lg:px-10"><Outlet /></section>
    </div>
  );
};

export default PortalLayout;
