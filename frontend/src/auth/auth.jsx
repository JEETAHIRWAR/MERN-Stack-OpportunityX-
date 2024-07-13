// auth.js
import axios from "../utils/api";

import React, { createContext, useContext, useState } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store authenticated user data

  // Function to simulate login (replace with actual login logic)
  const login = (userData, token) => {
    setUser(userData); // Set user data upon successful login
    localStorage.setItem("token", token);
  };

  // const login = async (email, password) => {
  //   const response = await axios.post("/auth/login", { email, password });
  //   setUser(response.data.user);
  //   localStorage.setItem("token", response.data.token);
  // };

  // Function to simulate logout (replace with actual logout logic)
  const logout = () => {
    setUser(null); // Clear user data upon logout
    localStorage.removeItem("token");
  };

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
