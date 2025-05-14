// src/utils/api.js or similar

// Log environment variables for debugging
console.log("Environment variables:", {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "Not defined"
});

// Fallback to localhost if environment variable is not defined
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
console.log("Using backend URL:", backendUrl);

if (!backendUrl) {
  throw new Error('VITE_BACKEND_URL environment variable is not defined and no fallback is available');
}

export const API_URL = backendUrl + '/api/v1';
console.log("Full API URL:", API_URL);

export const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log("Added authorization header");
  } else {
    console.log("No token provided for headers");
  }

  return headers;
};
