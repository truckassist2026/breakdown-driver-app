import API_BASE_URL from '../config/api';
import { getToken } from '../utils/authStorage';

export async function apiRequest(
  endpoint,
  options = {}
) {
  const {
    method = 'GET',
    body,
    token: providedToken,
  } = options;

  const token =
    providedToken || await getToken();

  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const url =
    `${API_BASE_URL}${endpoint}`;

  console.log(
    `[Truck Assist API] ${method} ${url}`
  );

  let response;

  try {
    response = await fetch(
      url,
      {
        method,
        headers,
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
      }
    );
  } catch (error) {
    console.error(
      '[Truck Assist API] Network error:',
      error
    );

    throw new Error(
      'Unable to connect to Truck Assist server.'
    );
  }

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
    data = await response.json();
  } else {
    const text =
      await response.text();

    data = text
      ? { message: text }
      : null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
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