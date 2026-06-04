import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const data = await api.post('/auth/login', credentials);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    return api.post('/auth/signup', payload);
  }

  async function logout() {
    await api.post('/auth/logout', {});
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, setUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

