import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const baseURL = import.meta.env.VITE_API_BASE_URL || "https://socialvibebackend-5.onrender.com/api";
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token: token || null,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
      isLoading: false
    };
  });

  const login = async (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      token,
      user,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const checkAuth = async () => {
    if (authState.token && !authState.isAuthenticated) {
      try {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true
        }));
      } catch (error) {
        logout();
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      baseURL
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Add this custom hook at the bottom of the file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};