"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem('admin_token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(storedToken);
      } else {
        // Token invalid, clear storage
        clearAuthData();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    setUser(null);
    setToken(null);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store authentication data
        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('user_email', data.data.user.email);
        localStorage.setItem('user_id', data.data.user.id);
        
        setUser(data.data.user);
        setToken(data.data.token);
        
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    clearAuthData();
    router.push('/admin/login');
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user && !!token
  };
};