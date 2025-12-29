import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/profile');
          setUser(data.data.user);
          localStorage.setItem('user', JSON.stringify(data.data.user));
        } catch (error) {
          console.error("Failed to fetch user profile", error);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
             setUser(JSON.parse(storedUser));
          }
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
    const { data } = await api.post(endpoint, { email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data;
  };

  // Step 1: Request OTP (Does NOT log in the user yet)
  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data; 
  };

  // Step 2: Verify OTP (Logs in the user)
  const verifyOtp = async (otpData) => {
    const { data } = await api.post('/auth/verify-otp', otpData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user); // Update state directly, NO reload needed
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, register, verifyOtp, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
