import { saveAuthSession } from '../utils/authStorage';
import { apiRequest } from './api';

const AUTH_ENDPOINTS = {
  sendOtp: '/api/v1/auth/send-otp',
  verifyOtp: '/api/v1/auth/verify-otp',
};

// =========================================================
// SEND DRIVER OTP
// =========================================================

export async function sendDriverOtp(phone) {
  if (!phone) {
    throw new Error(
      'Phone number is required.'
    );
  }

  return apiRequest(
    AUTH_ENDPOINTS.sendOtp,
    {
      method: 'POST',
      body: {
        phone,
      },
    }
  );
}

// =========================================================
// VERIFY DRIVER OTP
// =========================================================

export async function verifyDriverOtp(
  phone,
  otp
) {
  if (!phone) {
    throw new Error(
      'Phone number is required.'
    );
  }

  if (!otp) {
    throw new Error(
      'OTP is required.'
    );
  }

  const response =
    await apiRequest(
      AUTH_ENDPOINTS.verifyOtp,
      {
        method: 'POST',
        body: {
          phone,
          otp,
        },
      }
    );

  // Backend returns:
  //
  // {
  //   accessToken,
  //   tokenType,
  //   expiresInSeconds,
  //   userId,
  //   role,
  //   newUser
  // }

  if (!response?.accessToken) {
    throw new Error(
      'Authentication succeeded but the server did not return an access token.'
    );
  }

  const user = {
    id: response.userId,
    role: response.role,
    isNewUser: response.newUser,
  };

  await saveAuthSession(
    response.accessToken,
    user
  );

  return {
    ...response,
    user,
  };
}