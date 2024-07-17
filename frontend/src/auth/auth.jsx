// auth.jsx
import axios from "../utils/api";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store authenticated user data

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Function to simulate login (replace with actual login logic)
  const login = (userData, token) => {
    setUser(userData); // Set user data upon successful login
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to simulate logout (replace with actual logout logic)
  const logout = () => {
    setUser(null); // Clear user data upon logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // // Check for token in local storage on component mount
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // Simulate fetching user data with the token
  //     // Replace this with actual API call to get user data
  //     const userData = { username: "exampleUser" }; // Replace with actual user data
  //     setUser(userData);
  //   }
  // }, []);

  // Check for token in local storage on component mount
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // Simulate fetching user data with the token
  //     axios
  //       .get("/user", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setUser(response.data); // Assuming response.data contains user data
  //       })
  //       .catch((error) => {
  //         if (error.response) {
  //           // The request was made and the server responded with a status code
  //           // that falls out of the range of 2xx
  //           console.error("Error response data:", error.response.data);
  //           console.error("Error response status:", error.response.status);
  //           console.error("Error response headers:", error.response.headers);
  //         } else if (error.request) {
  //           // The request was made but no response was received
  //           console.error("Error request:", error.request);
  //         } else {
  //           // Something happened in setting up the request that triggered an Error
  //           console.error("Error message:", error.message);
  //         }
  //         localStorage.removeItem("token");
  //       });
  //   }
  // }, []);

  // Context value to be provided to consumers
  const authContextValue = {
    user,
    login,
    logout,
  };

  // Provide the authentication context to children components
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext); // Consume the authentication context

  // Throw an error if used outside of AuthProvider
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context; // Return the authentication context
};
