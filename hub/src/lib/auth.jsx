import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "./api";

const AuthContext = createContext(null);

const TOKEN_KEY = "ssn_unified_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api
        .get("/api/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  async function login(username, password) {
    const res = await api.post("/api/auth/login", { username, password });
    localStorage.setItem(TOKEN_KEY, res.data.token);
    setAuthToken(res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  // Builds the URL used to open a satellite app with the shared token attached as a query param.
  function satelliteUrl(baseUrl) {
    if (!token) return baseUrl;
    const sep = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${sep}token=${encodeURIComponent(token)}`;
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, satelliteUrl }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
