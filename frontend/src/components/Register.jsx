import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/api";
import { useAuth } from "../auth/auth";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (role === "admin" && code !== "2580") {
      setError("Invalid admin code");
      return;
    }
    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
        role,
        code,
      });
      //console.log("User registered successfully:", response.data);
      const { token, user } = response.data;
      login(user, token); // Update the auth context with the user and token
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (error) {
      //console.error("Error registering user:", error);
      setError(error.response?.data?.message || "API request failed");
    }
  };

  return (
    <div className="flex items-center justify-center mt-12 mb-12 bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">SignUp</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 ml-0"
            >
              Enter your username
            </label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700 ml-0"
            >
              Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 ml-0"
            >
              Create password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 mt-1 border-slate-300 border rounded-lg"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border-slate-300 border rounded-lg p-3"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {role === "admin" && (
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Admin Code"
              required
            />
          )}
          <button
            type="submit"
            className="w-full py-3 text-white bg-slate-600 rounded-lg hover:bg-slate-500"
          >
            Register
          </button>
          <p className="text-center text-gray-600">
            Already have an Account?{" "}
            <Link to="/login" className="text-blue-500">
              Sign In Now
            </Link>
          </p>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default RegistrationForm;
