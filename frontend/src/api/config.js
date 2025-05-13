// src/utils/api.js or similar

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL environment variable is not defined');
}

export const API_URL = import.meta.env.VITE_BACKEND_URL + '/api/v1';

export const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
