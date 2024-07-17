import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/auth/reset-password", {
        token,
        password,
      });
      setMessage(response.data.message);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "API request failed");
      setMessage(null);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-slate-600 rounded-lg hover:bg-slate-500"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <div className="flex items-center space-x-2">
            <img
              src="./OpportunityX__1.png"
              alt="Success"
              className="w-6 h-6"
            />
            <p className="text-green-500">{message}</p>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
