import React from 'react';

const AuthContext = React.createContext({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  refreshSession: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchWithCredentials = React.useCallback(async (url, options = {}) => {
    const res = await fetch(url, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    return res;
  }, []);

  const refreshSession = React.useCallback(async () => {
    try {
      const res = await fetchWithCredentials('http://localhost/backend/user/check-session.php');
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data?.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error('Session check failed', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [fetchWithCredentials]);

  React.useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = React.useCallback(
    async (email, password) => {
      setError(null);
      const res = await fetchWithCredentials('http://localhost/backend/user/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.message || 'Login failed');
        throw new Error(data?.message || 'Login failed');
      }
      setUser(data.user);
      setLoading(false);
      return data.user;
    },
    [fetchWithCredentials]
  );

  const signup = React.useCallback(
    async (payload) => {
      setError(null);
      const res = await fetchWithCredentials('http://localhost/backend/user/signup.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data?.error) {
        setError(data?.message || 'Signup failed');
        throw new Error(data?.message || 'Signup failed');
      }
      setUser(data.user);
      setLoading(false);
      return data.user;
    },
    [fetchWithCredentials]
  );

  const logout = React.useCallback(async () => {
    try {
      await fetchWithCredentials('http://localhost/backend/user/logout.php', { method: 'POST' });
    } finally {
      setUser(null);
      setLoading(false);
    }
  }, [fetchWithCredentials]);

  const value = React.useMemo(
    () => ({ user, loading, error, login, signup, logout, refreshSession }),
    [user, loading, error, login, signup, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
