// auth.jsx
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";
import api from "../utils/api";
import { persistAuthSession } from "./authSession";

// Create a context for authentication
const AuthContext = createContext();

// Authentication provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data.user;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => setAuthLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setAuthLoading(false);
    };
    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  const login = (authResponse, legacyToken) => {
    const authenticatedUser = persistAuthSession(
      authResponse,
      localStorage,
      legacyToken,
    );

    if (!authenticatedUser) {
      return false;
    }

    setUser(authenticatedUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
