import React, { useState } from "react";
import axios from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "API request failed");
      setMessage(null);
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
              className="w-full p-3 mt-1 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
