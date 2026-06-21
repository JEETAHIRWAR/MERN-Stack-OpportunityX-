import { Link } from "react-router-dom";
import Logo from "./Logo";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
          <Link to="/" className="text-white"><Logo /></Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">A trusted workspace for candidates and verified hiring teams to discover opportunities and move applications forward.</p>
          <div className="mt-5 flex gap-3"><a href="https://www.linkedin.com/company/ghostcodedynamics" aria-label="LinkedIn" className="rounded-lg border border-slate-800 p-2 hover:text-white"><FaLinkedin /></a><a href="https://github.com" aria-label="GitHub" className="rounded-lg border border-slate-800 p-2 hover:text-white"><FaGithub /></a></div>
        </div>
        {[
          ["Company", [["About", "/about"], ["Careers", "/"], ["Contact", "mailto:ghostcodedynamics@gmail.com"]]],
          ["Candidates", [["Browse jobs", "/"], ["Saved jobs", "/saved-jobs"], ["Applications", "/my-applications"]]],
          ["Recruiters", [["Post jobs", "/recruiter/jobs/new"], ["Dashboard", "/recruiter/dashboard"]]],
        ].map(([title, links]) => (
          <div key={title}><h2 className="font-semibold text-white">{title}</h2><ul className="mt-4 space-y-3 text-sm">{links.map(([label, to]) => <li key={label}><Link to={to} className="hover:text-white">{label}</Link></li>)}</ul></div>
        ))}
      </div>
      <div className="border-t border-slate-800 px-4 py-5"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} OpportunityX. All rights reserved.</span><span className="flex gap-5"><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms</Link></span></div></div>
    </footer>
  );
};

export default Footer;
