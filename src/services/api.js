import { getToken } from '../utils/authStorage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  'https://truck-assist-backend.onrender.com';

export async function apiRequest(
  endpoint,
  options = {}
) {
  const token =
    await getToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  console.log(
    '[Truck Assist API]',
    options.method || 'GET',
    `${API_BASE_URL}${endpoint}`
  );

  console.log(
    '[Truck Assist API] Auth token:',
    token
      ? 'PRESENT'
      : 'MISSING'
  );

  const response =
    await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,

        body:
          options.body &&
          typeof options.body !== 'string'
            ? JSON.stringify(options.body)
            : options.body,
      }
    );

  const contentType =
    response.headers.get(
      'content-type'
    ) || '';

  let data = null;

  if (
    contentType.includes(
      'application/json'
    )
  ) {
    data =
      await response.json();
  } else {
    const text =
      await response.text();

    data =
      text || null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      data ||
      `Request failed with status ${response.status}`;

    const error =
      new Error(message);

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}