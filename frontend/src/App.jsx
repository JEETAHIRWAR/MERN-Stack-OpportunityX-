import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  GoogleOAuthProvider,
  GoogleLogin as GoogleSignIn,
} from "@react-oauth/google";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./auth/auth";
import LoadingDots from "./components/LoadingDots";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageNotFound from "./components/PageNotFound";

// Lazy load pages
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

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GoogleAuthWrapper1 = () => {
    return (
      <GoogleOAuthProvider clientId="743523469850-lqp5pi1tmggk0pm1289k47upuif9eg7f.apps.googleusercontent.com">
        <Login />
      </GoogleOAuthProvider>
    );
  };

  const GoogleAuthWrapper2 = () => {
    return (
      <GoogleOAuthProvider>
        <RegistrationForm />
      </GoogleOAuthProvider>
    );
  };

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-800">
        <img
          src="../public/404-Notfound.png"
          alt="404 Not Found"
          className="w-2/2 mb-4 z-10 relative"
        />
        <p className="text-3xl font-semibold text-slate-100 z-20 relative">
          Something went wrong. please try again
        </p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        {!error && <Navbar />}
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-screen">
                  <LoadingDots />
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Home setError={setError} />} />
                <Route path="/about" element={<About />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/register" element={<GoogleAuthWrapper2 />} />
                <Route path="/login" element={<GoogleAuthWrapper1 />} />
                <Route path="/google" element={<GoogleAuthWrapper1 />} />
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
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </main>
          {!error && <Footer />}
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

// import React, { useState, useEffect, Suspense, lazy } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import PrivateRoute from "./components/PrivateRoute";
// import { AuthProvider } from "./auth/auth";
// import LoadingDots from "./components/LoadingDots";
// import Footer from "./components/Footer";

// // Lazy load pages
// const Home = lazy(() => import("./pages/Home"));
// const RegistrationForm = lazy(() => import("./components/Register"));
// const JobDetails = lazy(() => import("./pages/JobDetails"));
// const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
// const UserProfile = lazy(() => import("./pages/UserProfile"));
// const Login = lazy(() => import("./components/Login"));
// const ManageJobs = lazy(() => import("./pages/ManageJobs"));
// const AddJob = lazy(() => import("./pages/AddJob"));
// const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
// const ResetPassword = lazy(() => import("./components/ResetPassword"));
// const About = lazy(() => import("./pages/About"));

// const App = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Simulate a network request
//     setTimeout(() => {
//       setLoading(false);
//     }, 3000);
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen">
//         <LoadingDots />
//       </div>
//     );
//   }

//   return (
//     <AuthProvider>
//       <Router>
//         {!error && <Navbar />}
//         <div className="flex flex-col min-h-screen">
//           <main className="flex-grow">
//             <Suspense
//               fallback={
//                 <div className="flex flex-col items-center justify-center h-screen">
//                   <LoadingDots />
//                 </div>
//               }
//             >
//               <Routes>
//                 <Route path="/" element={<Home setError={setError} />} />
//                 <Route path="/about" element={<About />} />
//                 <Route path="/job/:id" element={<JobDetails />} />
//                 <Route path="/register" element={<RegistrationForm />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route
//                   path="/reset-password/:token"
//                   element={<ResetPassword />}
//                 />
//                 <Route element={<PrivateRoute roles={["admin"]} />}>
//                   <Route path="/admin/dashboard" element={<AdminDashboard />}>
//                     <Route path="jobs" element={<ManageJobs />} />
//                     <Route path="add-job" element={<AddJob />} />
//                   </Route>
//                 </Route>
//                 <Route element={<PrivateRoute roles={["user", "admin"]} />}>
//                   <Route path="/profile" element={<UserProfile />} />
//                 </Route>
//               </Routes>
//             </Suspense>
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;
