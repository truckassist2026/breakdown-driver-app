import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  clearAuthSession,
  getUser,
  getValidToken,
  saveAuthSession,
} from '../utils/authStorage';

const AuthContext =
  createContext(null);

export function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] = useState(null);

  const [
    token,
    setToken,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =========================================================
  // RESTORE SESSION
  // =========================================================

  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession =
    async () => {

      try {

        const validToken =
          await getValidToken();

        if (!validToken) {

          setToken(null);
          setUser(null);

          return;
        }

        const storedUser =
          await getUser();

        setToken(
          validToken
        );

        setUser(
          storedUser
        );

        console.log(
          '[Auth] Valid stored session restored'
        );

      } catch (error) {

        console.error(
          '[Auth] Unable to restore session:',
          error
        );

        await clearAuthSession();

        setToken(null);
        setUser(null);

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

    if (!accessToken) {
      throw new Error(
        'Authentication token is missing.'
      );
    }

    await saveAuthSession(
      accessToken,
      userData
    );

    setToken(
      accessToken
    );

    setUser(
      userData || null
    );

    console.log(
      '[Auth] Login session established'
    );
  };

  // =========================================================
  // LOGOUT
  // =========================================================

 const logout = async () => {
  console.log('[Auth] Logout started');

  try {
    // Clear the stored authentication session
    await clearAuthSession();

    console.log(
      '[Auth] Stored session cleared'
    );

  } catch (error) {

    console.error(
      '[Auth] Failed to clear stored session:',
      error
    );

  } finally {

    // VERY IMPORTANT
    setToken(null);
    setUser(null);

    console.log(
      '[Auth] React authentication state cleared'
    );
  }
};

  // =========================================================
  // CONTEXT
  // =========================================================

  const value = {
    user,
    token,
    loading,

    isAuthenticated:
      Boolean(token),

    login,
    logout,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// HOOK
// =========================================================

export function useAuth() {

  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}