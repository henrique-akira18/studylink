import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  function clearSession() {
    setToken(null);
    setUser(null);
  }

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);

    authApi
      .me(token)
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        if (active) clearSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  async function login(email, password) {
    const data = await authApi.login(email, password);
    setToken(data.access_token);
    return data;
  }

  async function register(email, password) {
    await authApi.register(email, password);
    return login(email, password);
  }

  async function logout() {
    try {
      if (token) await authApi.logout(token);
    } catch {
      // A sessão em memória é encerrada mesmo se a saída falhar.
    }
    clearSession();
  }

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return context;
}
