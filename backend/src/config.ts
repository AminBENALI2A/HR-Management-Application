import * as dotenv from 'dotenv';

dotenv.config();

const getApiBaseUrl = () => {
  if (process.env.NODE_ENV == 'development') {
    return 'http://localhost:3000';
  }
  return 'https://d1pc059cxwtfw0.cloudfront.net'; // Prod
};

export const API_BASE_URL = getApiBaseUrl();