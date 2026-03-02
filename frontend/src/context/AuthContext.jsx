import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // To prevent flickering on refresh
  const [showLogin, setShowLogin] = useState(false);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("galaxy_user");
        const savedToken = localStorage.getItem("galaxy_token");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        logout(); // Clear storage if data is corrupted
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Modal Control Functions
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  /**
   * Login function to update state and persistence
   * @param {Object} userData - User details from API (id, name, email, role)
   * @param {string} token - JWT Token from API
   */
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("galaxy_token", token);
    localStorage.setItem("galaxy_user", JSON.stringify(userData));
  };

  /**
   * Logout function to clear all auth data
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("galaxy_token");
    localStorage.removeItem("galaxy_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        showLogin,
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};