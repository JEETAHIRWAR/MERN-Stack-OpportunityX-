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
    <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center px-4 py-12">
      <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-900 to-indigo-900 p-12 text-white lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-300">
            OpportunityX
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">
            Your next opportunity starts with a secure sign-in.
          </h1>
          <p className="mt-5 max-w-md text-slate-300">
            Track applications, save jobs, manage listings, and keep your
            profile ready for the right role.
          </p>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-slate-500">Use your OpportunityX account.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            </label>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Captcha</span>
                <NavLink to="/forgot-password" className="text-sm font-medium text-indigo-600">
                  Forgot password?
                </NavLink>
              </div>
              <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2">
                <span className="rounded-xl bg-slate-100 px-4 py-3 font-mono font-bold tracking-widest text-slate-700">
                  {captcha}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(generateCaptcha());
                    setCaptchaInput("");
                  }}
                  className="rounded-xl border border-slate-300 p-3 text-slate-600"
                  aria-label="Refresh captcha"
                >
                  <FaArrowRotateRight />
                </button>
                <input
                  required
                  value={captchaInput}
                  onChange={(event) => setCaptchaInput(event.target.value)}
                  placeholder="Enter code"
                  className="min-w-0 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
          {/* TODO: Re-enable Google OAuth after secure provider-side account linking is completed. */}
          <p className="mt-6 text-center text-sm text-slate-600">
            New to OpportunityX?{" "}
            <NavLink to="/register" className="font-semibold text-indigo-600">
              Create an account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
