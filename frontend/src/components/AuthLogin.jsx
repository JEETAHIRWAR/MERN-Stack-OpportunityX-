import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRotateRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import api from "../utils/api";
import { useAuth } from "../auth/auth";
import { getRoleRedirect } from "../auth/authSession";

const generateCaptcha = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const AuthLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (captchaInput.trim().toUpperCase() !== captcha) {
      toast.error("Captcha does not match");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      return;
    }

    setSubmitting(true);
    let authResponse;

    try {
      const { data } = await api.post("/auth/login", form);
      authResponse = data;
    } catch (error) {
      const message = error.response?.data?.message || "Unable to log in";
      toast.error(message);
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
      setSubmitting(false);
      return;
    }

    const authenticated = login(authResponse);

    if (!authenticated) {
      toast.error("Unable to complete login");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    navigate(getRoleRedirect(authResponse.user?.role), { replace: true });
    toast.success("Welcome back");

    // Stop after successful navigation so failure handling cannot run.
    return;
  };

  return (
    <div className="grid min-h-screen bg-slate-950 xl:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 p-12 text-white xl:flex">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
            OpportunityX
          </p>
          <div className="mx-auto mt-8 grid h-20 w-20 place-items-center rounded-3xl bg-white/15 text-3xl font-black ring-1 ring-white/20">OX</div>
          <h1 className="mt-8 text-4xl font-bold leading-tight">
            Welcome back
          </h1>
          <p className="mt-5 text-lg leading-8 text-indigo-100">
            Access your workspace, move applications forward, and discover the next opportunity worth pursuing.
          </p>
        </div>
      </div>
      <div className="flex min-w-0 items-center justify-center bg-slate-950 p-6 sm:p-10">
        <div className="w-full max-w-xl">
          <p className="text-lg font-extrabold text-white">Opportunity<span className="text-violet-500">X</span></p>
          <div className="mt-12">
          <h2 className="text-3xl font-bold text-white">Sign in</h2>
          <p className="mt-2 text-slate-400">Enter your credentials to access your account.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 pr-12 text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
            </label>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">Captcha</span>
                <NavLink to="/forgot-password" className="text-sm font-medium text-indigo-600">
                  Forgot password?
                </NavLink>
              </div>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2 sm:grid-cols-[auto_auto_1fr]">
                <span className="rounded-xl bg-slate-800 px-4 py-3 font-mono font-bold tracking-widest text-slate-200">
                  {captcha}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(generateCaptcha());
                    setCaptchaInput("");
                  }}
                  className="rounded-xl border border-slate-700 p-3 text-slate-300"
                  aria-label="Refresh captcha"
                >
                  <FaArrowRotateRight />
                </button>
                <input
                  required
                  value={captchaInput}
                  onChange={(event) => setCaptchaInput(event.target.value)}
                  placeholder="Enter code"
                  className="col-span-2 min-w-0 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500 sm:col-span-1"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          {/* TODO: Re-enable Google OAuth after secure provider-side account linking is completed. */}
          <p className="mt-6 text-center text-sm text-slate-400">
            New to OpportunityX?{" "}
            <NavLink to="/register" className="font-semibold text-indigo-600">
              Create an account
            </NavLink>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
