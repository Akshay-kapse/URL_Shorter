// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// export const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(null);
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);


//   useEffect(() => {
//   const token = localStorage.getItem('admin_token');
//   setIsAuthenticated(!!token);
//   setLoading(false);
// }, []);

//   const checkAuth = async () => {
//     try {
//       const storedToken = localStorage.getItem('admin_token');
//       const storedEmail = localStorage.getItem('user_email');

//       if (!storedToken || !storedEmail) {
//         setLoading(false);
//         return;
//       }

//       // Verify token with backend
//       const response = await fetch('/api/auth/verify', {
//         headers: {
//           'Authorization': `Bearer ${storedToken}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         setToken(storedToken);
//       } else {
//         // Token invalid, clear storage
//         localStorage.removeItem('admin_token');
//         localStorage.removeItem('user_email');
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//       localStorage.removeItem('admin_token');
//       localStorage.removeItem('user_email');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await fetch('/api/admin/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await response.json();

//       if (response.ok && data.token) {
//         localStorage.setItem('admin_token', data.token);
//         localStorage.setItem('user_email', email);
//         setUser(data.user);
//         setToken(data.token);
//         return { success: true };
//       } else {
//         return { success: false, error: data.error || 'Login failed' };
//       }
//     } catch (error) {
//       return { success: false, error: 'Network error' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('admin_token');
//     localStorage.removeItem('user_email');
//     setUser(null);
//     setToken(null);
//     router.push('/admin/login');
//   };

//   return {
//     user,
//     token,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user && !!token
//   };
// };

"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/auth/check", { withCredentials: true });
      setIsAuthenticated(res.data.authenticated);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, loading, checkAuth };
}
