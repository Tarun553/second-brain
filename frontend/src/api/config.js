
// API configuration
export const API_URL = 'http://localhost:3000/api/v1';

// Header configuration
export const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};