import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi.js';

export const AuthContext = createContext(null);

const STORAGE_TOKEN = 'marketplaceToken';
const STORAGE_USER = 'marketplaceUser';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveSession = useCallback((authData) => {
    localStorage.setItem(STORAGE_TOKEN, authData.token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login(payload);
      saveSession(data);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.register(payload);
      saveSession(data);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const updateProfile = useCallback(async (payload) => {
    setLoading(true);
    setError('');
    try {
      const data = await authApi.updateProfile(payload);
      saveSession(data);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  useEffect(() => {
    if (!token) return;

    authApi
      .getProfile()
      .then((profile) => {
        localStorage.setItem(STORAGE_USER, JSON.stringify(profile));
        setUser(profile);
      })
      .catch(() => logout());
  }, [logout, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
    }),
    [error, loading, login, logout, register, token, updateProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
