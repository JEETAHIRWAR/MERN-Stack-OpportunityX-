import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/auth";
import PrivateRoute from "./components/PrivateRoute";
import LoadingDots from "./components/LoadingDots";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const RegistrationForm = lazy(() => import("./components/Register"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Login = lazy(() => import("./components/Login"));
const ManageJobs = lazy(() => import("./pages/ManageJobs"));
const AddJob = lazy(() => import("./pages/AddJob"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const Footer = lazy(() => import("./components/Footer"));
const Navbar = lazy(() => import("./components/Navbar"));

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
        {!error && (
          <Suspense
            fallback={<LoadingDots />}
            className="flex flex-col items-center justify-center h-screen"
          >
            <Navbar />
          </Suspense>
        )}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense
              fallback={<LoadingDots />}
              className="flex flex-col items-center justify-center h-screen"
            >
              <Routes>
                <Route path="/" element={<Home setError={setError} />} />
                <Route path="/about" element={<About />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route element={<PrivateRoute roles={["admin"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />}>
                    <Route path="jobs" element={<ManageJobs />} />
                    <Route path="add-job" element={<AddJob />} />
                  </Route>
                </Route>

                <Route element={<PrivateRoute roles={["user", "admin"]} />}>
                  <Route path="/profile" element={<UserProfile />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Suspense
            fallback={<LoadingDots />}
            className="flex flex-col items-center justify-center h-screen"
          >
            <Footer /> {/* Add the Footer component here */}
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
