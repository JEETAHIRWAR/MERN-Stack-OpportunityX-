import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../auth/auth";
import { FaArrowRotateRight, FaEye, FaEyeSlash } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (captcha !== captchaInput) {
      toast.error("Captcha does not match. Please try again.");
      setCaptcha(generateCaptcha());
      return;
    }

    try {
      const response = await axios.post("/auth/login", { email, password });
      const { token, user } = response.data;
      localStorage.setItem("token", response.data.token);

      login(user, token);
      toast.success("Logged in successfully");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      setCaptcha(generateCaptcha());
      setCaptchaInput("");
    }
  };

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  };

  return (
    <div className="flex items-center justify-center mt-12 mb-12 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 ml-0"
            >
              Enter Your Email
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
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 ml-0"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-5 cursor-pointer text-slate-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p className="text-sm text-right text-gray-600">
              <NavLink to="/forgot-password" className="text-blue-500">
                Forgot Password?
              </NavLink>
            </p>
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
              <button
                type="button"
                onClick={refreshCaptcha}
                className=" text-gray-700 mr-2 hover:text-gray-900"
              >
                <FaArrowRotateRight className="text-lg" />
              </button>
              <input
                id="captcha"
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="flex-grow p-3 border-slate-300 border rounded-lg"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 text-white bg-slate-600 rounded-lg hover:bg-slate-500"
          >
            Login
          </button>
          <p className="text-center text-gray-600">
            New User?{" "}
            <NavLink to="/register" className="text-blue-500">
              Sign Up Now
            </NavLink>
          </p>
        </form>
        {/* {error && <p className="text-red-500">{error}</p>} */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
