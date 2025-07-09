import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/check-auth`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          setAdmin(data.admin);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAdmin(data.admin);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
    }
  };

  const createDefaultAdmin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/create-default`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const value = {
    admin,
    isAuthenticated,
    isLoading,
    login,
    logout,
    createDefaultAdmin,
    checkAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

