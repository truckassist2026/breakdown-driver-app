import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'truck_assist_access_token';
const USER_KEY = 'truck_assist_user';

// =========================================================
// INTERNAL STORAGE HELPERS
// =========================================================

async function setStorageItem(key, value) {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getStorageItem(key) {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function removeStorageItem(key) {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}

// =========================================================
// SAVE AUTH SESSION
// =========================================================

export async function saveAuthSession(
  token,
  user
) {
  if (!token) {
    throw new Error(
      'Cannot save authentication session without a token.'
    );
  }

  await setStorageItem(
    TOKEN_KEY,
    token
  );

  await setStorageItem(
    USER_KEY,
    JSON.stringify(user || {})
  );
}

// =========================================================
// GET TOKEN
// =========================================================

export async function getToken() {
  return getStorageItem(
    TOKEN_KEY
  );
}

// =========================================================
// GET USER
// =========================================================

export async function getUser() {
  const value =
    await getStorageItem(
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
// CLEAR SESSION
// =========================================================

export async function clearAuthSession() {
  await removeStorageItem(
    TOKEN_KEY
  );

  await removeStorageItem(
    USER_KEY
  );
}

// =========================================================
// AUTHENTICATED CHECK
// =========================================================

export async function isAuthenticated() {
  const token =
    await getToken();

  return Boolean(token);
}