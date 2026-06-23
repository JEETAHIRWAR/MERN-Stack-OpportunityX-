import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChevronDown,
  FaCircleCheck,
  FaXmark,
} from "react-icons/fa6";
import Logo from "./Logo";
import { useAuth } from "../auth/auth";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? "bg-indigo-50 text-indigo-700"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
  }`;

const ModernNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "recruiter"
        ? "/recruiter/dashboard"
        : "/candidate/dashboard";

  const closeAndLogout = () => {
    logout();
    setOpen(false);
    setAccountOpen(false);
    navigate("/");
  };

  if (/^\/(login|register|verify-email|forgot-password|reset-password)\b/.test(pathname)) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <NavLink to="/" className="text-slate-950"><Logo /></NavLink>
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>Find jobs</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          {user?.role === "candidate" && (
            <>
              <NavLink to="/saved-jobs" className={navClass}>Saved jobs</NavLink>
              <NavLink to="/my-applications" className={navClass}>Applications</NavLink>
            </>
          )}
          {user ? (
            <>
              {user.role === "recruiter" && (
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${user.verificationStatus === "verified" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {user.verificationStatus === "verified" && <FaCircleCheck />}
                  {user.verificationStatus || "unverified"}
                </span>
              )}
              <div className="relative">
                <button type="button" onClick={() => setAccountOpen((value) => !value)} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">{user.username?.charAt(0).toUpperCase()}</span>
                  <span className="max-w-28 truncate">{user.username}</span>
                  <FaChevronDown className="text-xs text-slate-400" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                    <NavLink to={dashboardPath} onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open dashboard</NavLink>
                    {user.role === "candidate" && <NavLink to="/profile" onClick={() => setAccountOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Profile</NavLink>}
                    <button type="button" onClick={closeAndLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Sign in</NavLink>
              <NavLink to="/register" className="primary-button !px-4 !py-2 !shadow-none">Get started</NavLink>
            </>
          )}
        </div>
        <button type="button" className="rounded-lg p-2 text-slate-700 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <FaXmark size={22} /> : <FaBars size={20} />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>Find jobs</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>About</NavLink>
          {user?.role === "candidate" && <>
            <NavLink to="/saved-jobs" className={navClass} onClick={() => setOpen(false)}>Saved jobs</NavLink>
            <NavLink to="/my-applications" className={navClass} onClick={() => setOpen(false)}>Applications</NavLink>
          </>}
          {user ? <>
            <NavLink to={dashboardPath} className={navClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
            <button type="button" onClick={closeAndLogout} className="rounded-lg px-3 py-2 text-left text-rose-600">Logout</button>
          </> : <>
            <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>Sign in</NavLink>
            <NavLink to="/register" className={navClass} onClick={() => setOpen(false)}>Get started</NavLink>
          </>}
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;
