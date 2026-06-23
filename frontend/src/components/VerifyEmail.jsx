import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(new URLSearchParams(location.search).get("email") || "");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const verify = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/verify-email", { email, code });
      toast.success("Email verified");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to verify email");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const { data } = await api.post("/auth/resend-verification", { email });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend code");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-white">
      <form onSubmit={verify} className="w-full max-w-md text-center">
        <p className="text-xl font-extrabold">Opportunity<span className="text-violet-500">X</span></p>
        <h1 className="mt-10 text-3xl font-bold">Verify your email</h1>
        <p className="mt-2 text-slate-400">Enter the six-digit code sent to your email.</p>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-8 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" placeholder="Email" />
        <input inputMode="numeric" pattern="\d{6}" maxLength="6" required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-4 text-center font-mono text-2xl tracking-[0.5em] text-white" placeholder="000000" />
        <button disabled={submitting} className="primary-button mt-5 w-full">{submitting ? "Verifying..." : "Verify email"}</button>
        <button type="button" onClick={resend} className="mt-5 text-sm font-semibold text-indigo-400">Resend code</button>
        <Link to="/login" className="mt-5 block text-sm text-slate-400">Back to sign in</Link>
      </form>
    </main>
  );
};

export default VerifyEmail;
