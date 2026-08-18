import { Platform } from 'react-native';

const TOKEN_KEY =
  'truckassist_access_token';

const USER_KEY =
  'truckassist_user';

let SecureStore = null;

if (Platform.OS !== 'web') {
  SecureStore =
    require('expo-secure-store');
}

// =========================================================
// STORAGE
// =========================================================

async function setStorage(
  key,
  value
) {
  if (Platform.OS === 'web') {
    if (
      typeof window !== 'undefined'
    ) {
      window.localStorage.setItem(
        key,
        value
      );
    }

    return;
  }

  await SecureStore.setItemAsync(
    key,
    value
  );
}

async function getStorage(key) {
  if (Platform.OS === 'web') {
    if (
      typeof window !== 'undefined'
    ) {
      return window.localStorage.getItem(
        key
      );
    }

    return null;
  }

  return SecureStore.getItemAsync(
    key
  );
}

async function removeStorage(key) {
  if (Platform.OS === 'web') {
    if (
      typeof window !== 'undefined'
    ) {
      window.localStorage.removeItem(
        key
      );
    }

    return;
  }

  await SecureStore.deleteItemAsync(
    key
  );
}

// =========================================================
// SAVE AUTH SESSION
// =========================================================

export async function saveAuthSession(
  token,
  user
) {
  await setStorage(
    TOKEN_KEY,
    token
  );

  await setStorage(
    USER_KEY,
    JSON.stringify(user || null)
  );
}

// =========================================================
// GET TOKEN
// =========================================================

export async function getToken() {
  return getStorage(
    TOKEN_KEY
  );
}

// =========================================================
// GET USER
// =========================================================

export async function getUser() {
  const value =
    await getStorage(
      USER_KEY
    );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(
      'Unable to parse stored user:',
      error
    );

    return null;
  }
}

// =========================================================
// CHECK JWT EXPIRY
// =========================================================

export function isTokenExpired(
  token
) {
  if (!token) {
    return true;
  }

  try {
    const parts =
      token.split('.');

    if (parts.length !== 3) {
      return true;
    }

    const payload =
      JSON.parse(
        decodeBase64Url(
          parts[1]
        )
      );

    if (!payload.exp) {
      // If there is no expiry claim,
      // let backend decide.
      return false;
    }

    const expiry =
      Number(payload.exp) * 1000;

    return (
      Date.now() >= expiry
    );

  } catch (error) {
    console.error(
      'Unable to inspect JWT:',
      error
    );

    return true;
  }
}

// =========================================================
// BASE64 URL DECODER
// =========================================================

function decodeBase64Url(
  value
) {
  let base64 =
    value
      .replace(/-/g, '+')
      .replace(/_/g, '/');

  while (
    base64.length % 4
  ) {
    base64 += '=';
  }

  if (
    typeof globalThis.atob ===
    'function'
  ) {
    return globalThis.atob(
      base64
    );
  }

  if (
    typeof Buffer !==
    'undefined'
  ) {
    return Buffer
      .from(
        base64,
        'base64'
      )
      .toString('utf-8');
  }

  throw new Error(
    'Unable to decode JWT'
  );
}

// =========================================================
// CLEAR SESSION
// =========================================================

export async function clearAuthSession() {
  await Promise.all([
    removeStorage(
      TOKEN_KEY
    ),
    removeStorage(
      USER_KEY
    ),
  ]);
}

// =========================================================
// VALID SESSION
// =========================================================

export async function getValidToken() {
  const token =
    await getToken();

  if (!token) {
    return null;
  }

  if (
    isTokenExpired(token)
  ) {
    console.log(
      '[Auth] Stored JWT expired - clearing session'
    );

    await clearAuthSession();

    return null;
  }

  return token;
}