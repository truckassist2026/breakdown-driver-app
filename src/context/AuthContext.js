import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  clearAuthSession,
  getToken,
  getUser,
} from '../utils/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      if (storedToken) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error(
        'Unable to restore authentication session:',
        error
      );

      await clearAuthSession();
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (
    accessToken,
    userData
  ) => {
    setToken(accessToken);
    setUser(userData);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = async () => {
    try {
      await clearAuthSession();
    } catch (error) {
      console.error(
        'Logout error:',
        error
      );
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ===========================================================
// AUTH HOOK
// ===========================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}