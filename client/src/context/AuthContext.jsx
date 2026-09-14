import { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const TOKEN_KEY = "jadara_token";
const USER_KEY = "jadara_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !localStorage.getItem(USER_KEY)) {
      api
        .get("/api/auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const setSession = useCallback((data) => {
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/api/auth/login", { email, password });
      setSession(res.data);
      return res.data;
    },
    [setSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      const res = await api.post("/api/auth/register", { name, email, password });
      setSession(res.data);
      return res.data;
    },
    [setSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}