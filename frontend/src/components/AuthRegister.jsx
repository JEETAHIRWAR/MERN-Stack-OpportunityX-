import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import api from "../utils/api";

const AuthRegister = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/register", form);
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to create account";
      toast.error(message);
      setSubmitting(false);
      return;
    }

    // Registration does not auto-login; login owns canonical session storage.
    setSubmitting(false);
    navigate("/login", { replace: true });
    toast.success("Account created successfully");
    return;
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-900 to-indigo-900 p-12 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
            OpportunityX
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Build your next career chapter or hiring team.
          </h1>
          <p className="mt-5 max-w-md text-slate-300">
            Candidates can save and track opportunities. Recruiters get a
            verified workspace for trusted hiring.
          </p>
          <div className="mt-10 space-y-4 text-sm text-slate-300">
            {[
              "A focused job search experience",
              "Transparent application tracking",
              "Verified recruiter publishing",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-indigo-400/20 text-indigo-200">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-slate-500">
            Join as a candidate or recruiter.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                required
                minLength={2}
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-3.5 text-slate-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <span className="mt-1 block text-xs text-slate-500">
                Use at least 8 characters.
              </span>
            </label>
            <fieldset>
              <legend className="text-sm font-medium text-slate-700">
                Account type
              </legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {[
                  ["candidate", "Candidate", "Find and track jobs"],
                  ["recruiter", "Recruiter", "Build a verified team"],
                ].map(([value, label, description]) => (
                  <label
                    key={value}
                    className={`cursor-pointer rounded-xl border p-3 transition ${
                      form.role === value
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={form.role === value}
                      onChange={(event) =>
                        setForm({ ...form, role: event.target.value })
                      }
                      className="sr-only"
                    />
                    <span className="block font-semibold text-slate-900">
                      {label}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      {description}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already registered?{" "}
            <NavLink to="/login" className="font-semibold text-indigo-600">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;
