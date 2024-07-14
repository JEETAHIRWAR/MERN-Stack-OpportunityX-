import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../auth/auth";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let captcha = "";
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captcha !== captchaInput) {
      setError("Captcha does not match. Please try again.");
      setCaptcha(generateCaptcha());
      return;
    }

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, user } = response.data;

      login(user, token);
      // console.log(token);

      if (user.role === "admin") {
        console.log("login Successfully");
        console.log("login Successfully", user.role);
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <p className="text-center text-gray-600">
          New User?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up Now
          </a>
        </p>
        <form onSubmit={handleLogin} className="space-y-6">
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 mt-1 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="captcha"
              className="block text-sm font-medium text-gray-700"
            >
              Captcha
            </label>
            <div className="flex items-center mt-1">
              <div className="px-4 py-2 mr-4 font-mono text-lg font-bold text-gray-800 bg-gray-200 rounded-lg">
                {captcha}
              </div>
              <input
                id="captcha"
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="flex-grow p-3 border rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600">
            <a href="/forgot-password" className="text-blue-500">
              Forgot Password?
            </a>
          </p>
        </form>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
