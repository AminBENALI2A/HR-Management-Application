// src/config.js
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8080/api'; // Local dev
  }
  return 'https://d1pc059cxwtfw0.cloudfront.net/api'; // Prod
};

export const API_BASE_URL = getApiBaseUrl();