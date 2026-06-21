import { useState } from "react";
import axios from "../utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "API request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Forgot Password
        </h2>
        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-white bg-slate-600 rounded-lg hover:bg-slate-500"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
