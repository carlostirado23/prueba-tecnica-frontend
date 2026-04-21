import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminKey, setAdminKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const key = localStorage.getItem('admin_key');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ cedula: payload.cedula, token });
      } catch (e) {
        localStorage.removeItem('jwt_token');
      }
    }
    if (key) {
      setAdminKey(key);
    }
    setLoading(false);
  }, []);

  const login = (cedula, token) => {
    localStorage.setItem('jwt_token', token);
    setUser({ cedula, token });
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  const loginAdmin = (key) => {
    localStorage.setItem('admin_key', key);
    setAdminKey(key);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_key');
    setAdminKey(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, adminKey, loginAdmin, logoutAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
