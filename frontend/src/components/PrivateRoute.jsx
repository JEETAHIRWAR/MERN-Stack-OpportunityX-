// PrivateRoute.jsx

import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth"; // Adjust path as per your project structure

const PrivateRoute = ({ roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    // Role not authorized, redirect to home
    return <Navigate to="/" replace />;
  }

  // Authorized, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
