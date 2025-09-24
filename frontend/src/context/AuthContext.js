import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // initialize state on first render
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);   // 👈 state update
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);  // 👈 state update
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
