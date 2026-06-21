import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/ModernNavbar";
import PrivateRoute from "./components/PrivateRoute";
import LoadingDots from "./components/LoadingDots";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/PageNotFound";

// Lazy load pages
const Home = lazy(() => import("./pages/ModernHome"));
const RegistrationForm = lazy(() => import("./components/AuthRegister"));
const JobDetails = lazy(() => import("./pages/ModernJobDetails"));
const AdminDashboard = lazy(() => import("./pages/AdminOverview"));
const UserProfile = lazy(() => import("./pages/CandidateProfile"));
const Login = lazy(() => import("./components/AuthLogin"));
const ManageJobs = lazy(() => import("./pages/ModernManageJobs"));
const AddJob = lazy(() => import("./pages/JobForm"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const About = lazy(() => import("./pages/About"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const ManageApplicants = lazy(() => import("./pages/ManageApplicants"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminApplications = lazy(() => import("./pages/AdminApplications"));
const PortalLayout = lazy(() => import("./components/PortalLayout"));
const CandidateDashboard = lazy(() => import("./pages/CandidateDashboard"));
const AdminRecruiters = lazy(() => import("./pages/AdminRecruiters"));

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="flex min-h-screen flex-col bg-slate-50">
        <main className="flex-grow">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-screen">
                  <LoadingDots />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<ModernHome />} />
                <Route path="/about" element={<About />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<Login />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route
                  element={<PrivateRoute roles={["candidate", "admin"]} />}
                >
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                  <Route path="/saved-jobs" element={<SavedJobs />} />
                  <Route path="/my-applications" element={<MyApplications />} />
                </Route>

                <Route
                  element={<PrivateRoute roles={["recruiter", "admin"]} />}
                >
                  <Route
                    path="/recruiter"
                    element={<PortalLayout role="recruiter" />}
                  >
                    <Route path="dashboard" element={<RecruiterDashboard />} />
                    <Route path="jobs" element={<ManageJobs />} />
                    <Route path="jobs/new" element={<AddJob />} />
                    <Route path="jobs/:id/edit" element={<AddJob />} />
                    <Route
                      path="applicants/:jobId"
                      element={<ManageApplicants />}
                    />
                  </Route>
                </Route>

                <Route element={<PrivateRoute roles={["admin"]} />}>
                  <Route
                    path="/admin"
                    element={<PortalLayout role="admin" />}
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="jobs" element={<ManageJobs />} />
                    <Route path="jobs/new" element={<AddJob />} />
                    <Route path="jobs/:id/edit" element={<AddJob />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="recruiters" element={<AdminRecruiters />} />
                    <Route
                      path="applications"
                      element={<AdminApplications />}
                    />
                    <Route
                      path="applicants/:jobId"
                      element={<ManageApplicants />}
                    />
                  </Route>
                </Route>
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
        </main>
        <Footer />
        <ToastContainer position="top-right" />
      </div>
    </Router>
  );
};

export default App;
