import API_BASE_URL from '../config/api';

export async function apiRequest(
  endpoint,
  options = {}
) {
  const {
    method = 'GET',
    body,
    token,
  } = options;

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
    `[API] ${method} ${url}`
  );

  const response = await fetch(
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

  const contentType =
    response.headers.get(
      'content-type'
    ) || '';

  let data;

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
      `Request failed (${response.status})`;

    const error =
      new Error(message);

    error.status =
      response.status;

    error.data = data;

    throw error;
  }

  return data;
}