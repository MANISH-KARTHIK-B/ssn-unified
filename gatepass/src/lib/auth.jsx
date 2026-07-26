import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "./api";

const TOKEN_KEY = "gatepass_token"; // each satellite app keeps its own local copy of the shared token
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlToken = url.searchParams.get("token");
    let initialToken = urlToken || localStorage.getItem(TOKEN_KEY);

    if (urlToken) {
      localStorage.setItem(TOKEN_KEY, urlToken);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());
    }

    if (!initialToken) {
      setLoading(false);
      return;
    }

    setAuthToken(initialToken);
    api
      .get("/api/auth/me")
      .then((res) => {
        setToken(initialToken);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
