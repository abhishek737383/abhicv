import React, { createContext, useState } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

/**
 * AuthProvider component wraps around parts of the app that need authentication data.
 */
export const AuthProvider = ({ children }) => {
  // Retrieve token from localStorage if available
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  /**
   * Function to log in the user. It saves the token to local state and localStorage.
   */
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  /**
   * Function to log out the user. It removes the token from local state and localStorage.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
