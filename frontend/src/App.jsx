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
const ModernHome = lazy(() => import("./pages/ModernHome"));
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
const RecruiterCompany = lazy(() => import("./pages/RecruiterCompany"));
const Notifications = lazy(() => import("./pages/Notifications"));
const WorkspaceAnalytics = lazy(() => import("./pages/WorkspaceAnalytics"));
const Settings = lazy(() => import("./pages/Settings"));
const JobAlerts = lazy(() => import("./pages/JobAlerts"));
const AiWorkspace = lazy(() => import("./pages/AiWorkspace"));
const Messages = lazy(() => import("./pages/Messages"));
const VerifyEmail = lazy(() => import("./components/VerifyEmail"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const AdminReports = lazy(() => import("./pages/AdminReports"));

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
                <Route path="/profile/:username" element={<PublicProfile />} />
                <Route path="/register" element={<RegistrationForm />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<VerifyEmail />} />

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route
                  element={<PrivateRoute roles={["candidate", "admin"]} />}
                >
                  <Route element={<PortalLayout role="candidate" />}>
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
                    <Route path="/saved-jobs" element={<SavedJobs />} />
                    <Route path="/my-applications" element={<MyApplications />} />
                    <Route path="/candidate/notifications" element={<Notifications />} />
                    <Route path="/candidate/job-alerts" element={<JobAlerts />} />
                    <Route path="/candidate/recommendations" element={<AiWorkspace />} />
                    <Route path="/candidate/messages" element={<Messages />} />
                    <Route path="/candidate/settings" element={<Settings />} />
                  </Route>
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
                    <Route path="company" element={<RecruiterCompany />} />
                    <Route path="analytics" element={<WorkspaceAnalytics />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="copilot" element={<AiWorkspace />} />
                    <Route path="settings" element={<Settings />} />
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
                    <Route path="analytics" element={<WorkspaceAnalytics />} />
                    <Route path="settings" element={<Settings />} />
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
