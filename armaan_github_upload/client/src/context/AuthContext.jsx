import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('webhub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        localStorage.removeItem('webhub_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    localStorage.setItem('webhub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('webhub_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('webhub_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.updateProfile(data);
    setUser((prev) => ({ ...prev, ...res.user }));
    return res.user;
  };

  // 1-Click Demo Login Helper
  const demoLogin = async (roleType) => {
    let email = 'rajesh@techsolutions.com';
    let password = 'owner123';

    if (roleType === 'ADMIN') {
      email = 'admin@webhub.com';
      password = 'admin123';
    } else if (roleType === 'VISITOR') {
      email = 'visitor@gmail.com';
      password = 'visitor123';
    }

    return await login(email, password);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isOwner: user?.role === 'BUSINESS_OWNER',
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
    demoLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
