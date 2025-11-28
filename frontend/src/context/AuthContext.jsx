import React, { createContext, useState, useContext, useEffect } from 'react';
// Ensure endpoints contains resetPassword path in your client.js
import { apiCall, endpoints, MOCK_MODE } from '../api/client.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ledger_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const fetchUserDetails = async (basicUser) => {
    try {
      const res = await apiCall('/users', 'GET', null, basicUser, 'USER');
      const allUsers = await res.json();
      const fullProfile = allUsers.find(u => u.email === basicUser.email);
      
      if (fullProfile) {
        const completeUser = { ...fullProfile, apiKey: basicUser.apiKey };
        setUser(completeUser);
        localStorage.setItem('ledger_user', JSON.stringify(completeUser));
      } else {
        setUser(basicUser);
        localStorage.setItem('ledger_user', JSON.stringify(basicUser));
      }
    } catch (e) {
      console.error("Could not fetch full profile", e);
      setUser(basicUser);
      localStorage.setItem('ledger_user', JSON.stringify(basicUser));
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (MOCK_MODE) {
        const mockUser = { id: 1, email, firstName: 'Demo', lastName: 'User', apiKey: 'mock-key' };
        setUser(mockUser);
        localStorage.setItem('ledger_user', JSON.stringify(mockUser));
        return { success: true };
      }

      const res = await apiCall(endpoints.auth.login, 'POST', { email, password });
      const data = await res.json(); 
      
      const basicUser = { email: data.email, apiKey: data.apiKey };
      await fetchUserDetails(basicUser);
      
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      if (MOCK_MODE) return { success: true };
      await apiCall(endpoints.auth.register, 'POST', userData);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      if (MOCK_MODE) return { success: true, message: "Mock reset link sent" };
      const res = await apiCall(endpoints.auth.forgotPassword, 'POST', { email });
      const msg = await res.text(); 
      return { success: true, message: msg };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTION ADDED HERE ---
  const confirmReset = async (token, newPassword, confirmPassword) => {
    setLoading(true);
    try {
      if (MOCK_MODE) return { success: true };
      
      const url = `${endpoints.auth?.resetPassword || '/auth/reset-password'}?token=${token}`;
      
      // FIX: Map 'confirmPassword' to 'confirmNewPassword' to match Java DTO
      const payload = { 
        newPassword: newPassword, 
        confirmNewPassword: confirmPassword 
      };
      
      await apiCall(url, 'POST', payload);
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ledger_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      forgotPassword, 
      confirmReset, // <--- EXPORTED HERE
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);