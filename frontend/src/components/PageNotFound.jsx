import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirects to the login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold text-black mb-4">
        404 Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={handleLoginRedirect}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Go to Login
      </button>
    </div>
  );
};

export default PageNotFound;
