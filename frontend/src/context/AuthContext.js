import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      API.get("auth/me/")
        .then((res) => setIsStaff(res.data.is_staff))
        .catch(() => {
          // Token is invalid/expired and refresh failed — clean up
          localStorage.removeItem("token");
          localStorage.removeItem("refresh");
          setIsLoggedIn(false);
          setIsStaff(false);
        });
    }
  }, []);

  const login = async (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    try {
      const res = await API.get("auth/me/");
      setIsStaff(res.data.is_staff);
    } catch {
      setIsStaff(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setIsStaff(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
