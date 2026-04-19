import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginAdmin, getMe } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const token = localStorage.getItem('sbj_token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await getMe();
      setAdmin(data.admin);
    } catch {
      localStorage.removeItem('sbj_token');
      localStorage.removeItem('sbj_admin');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAdmin(); }, [loadAdmin]);

  const login = async (credentials) => {
    const { data } = await loginAdmin(credentials);
    localStorage.setItem('sbj_token', data.token);
    localStorage.setItem('sbj_admin', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sbj_token');
    localStorage.removeItem('sbj_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
