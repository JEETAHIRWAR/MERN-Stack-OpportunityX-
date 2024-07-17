// App.jsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RegistrationForm from "./components/Register";
import JobDetails from "./pages/JobDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/UserProfile";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute"; // Adjust path as per your project structure
import { AuthProvider } from "./auth/auth";
import ManageJobs from "./pages/ManageJobs";
import AddJob from "./pages/AddJob";
import LoadingDots from "./components/LoadingDots";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import About from "./pages/About";
import Footer from "./components/Footer";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingDots />
      </div>
    );
  }
  return (
    <AuthProvider>
      <Router>
        {!error && <Navbar />}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home setError={setError} />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}

              <Route element={<PrivateRoute roles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />}>
                  <Route path="jobs" element={<ManageJobs />} />
                  <Route path="add-job" element={<AddJob />} />
                </Route>
              </Route>

              <Route element={<PrivateRoute roles={["user", "admin"]} />}>
                <Route path="/profile" element={<UserProfile />} />
              </Route>
              {/* <Route element={<PrivateRoute roles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route> */}
            </Routes>
          </main>
          <Footer /> {/* Add the Footer component here */}
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
