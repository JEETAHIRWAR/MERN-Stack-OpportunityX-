import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";
import Logo from "./Logo";
import { useAuth } from "../auth/auth";

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:text-white"
  }`;

const ModernNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "recruiter"
        ? "/recruiter/dashboard"
        : "/candidate/dashboard";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-slate-100">
          <Logo />
        </NavLink>
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navClass}>Jobs</NavLink>
          <NavLink to="/about" className={navClass}>About</NavLink>
          {user?.role === "candidate" && (
            <>
              <NavLink to="/saved-jobs" className={navClass}>Saved</NavLink>
              <NavLink to="/my-applications" className={navClass}>Applications</NavLink>
            </>
          )}
          {user ? (
            <>
              {user.role === "recruiter" && (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${user.verificationStatus === "verified" ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>
                  {user.verificationStatus || "unverified"}
                </span>
              )}
              <NavLink to={dashboardPath} className={navClass}>
                {user.role === "candidate" ? "Profile" : "Dashboard"}
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <NavLink
                to="/register"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
              >
                Create account
              </NavLink>
            </>
          )}
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-200 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
        >
          {open ? <FaXmark size={22} /> : <FaBars size={20} />}
        </button>
      </div>
      {open && (
        <div className="flex flex-col gap-2 border-t border-slate-700 px-4 py-4 md:hidden">
          <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>Jobs</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setOpen(false)}>About</NavLink>
          {user?.role === "candidate" && (
            <>
              <NavLink to="/saved-jobs" className={navClass} onClick={() => setOpen(false)}>Saved jobs</NavLink>
              <NavLink to="/my-applications" className={navClass} onClick={() => setOpen(false)}>My applications</NavLink>
            </>
          )}
          {user ? (
            <>
              <NavLink to={dashboardPath} className={navClass} onClick={() => setOpen(false)}>Dashboard</NavLink>
              <button type="button" onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-slate-200">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass} onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" className={navClass} onClick={() => setOpen(false)}>Create account</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default ModernNavbar;
