import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setSession = (token, userPayload) => {
    localStorage.setItem("anon_token", token);
    setUser(userPayload);
  };

  const logout = () => {
    localStorage.removeItem("anon_token");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("anon_token");
    if (!token) return setLoading(false);
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({ user, loading, setSession, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
