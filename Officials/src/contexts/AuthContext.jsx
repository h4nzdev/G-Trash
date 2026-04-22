import React, { createContext, useContext, useState, useEffect } from 'react';
import api from "@/services/apiClient";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gtrash_official_user");
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData && userData.accessToken) {
          setUser(userData);
        } else {
          localStorage.removeItem("gtrash_official_user");
        }
      }
    } catch (e) {
      console.error("Failed to load stored user:", e);
      localStorage.removeItem("gtrash_official_user");
    }
    setIsChecking(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.success && response.data.data) {
      const { accessToken, refreshToken, user: userData } = response.data.data;
      const storedUser = {
        ...userData,
        accessToken,
        refreshToken,
      };

      localStorage.setItem("gtrash_official_user", JSON.stringify(storedUser));
      setUser(storedUser);
      return storedUser;
    }

    throw new Error(response.data.message || "Login failed");
  };

  const logout = () => {
    localStorage.removeItem("gtrash_official_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isChecking,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};;
