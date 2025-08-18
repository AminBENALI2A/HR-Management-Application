import { API_BASE_URL } from "./config";

async function checkAuth() {
  const res = await fetch(`${API_BASE_URL}/auth/session`, {
    credentials: 'include', // sends the cookie to backend
  });
  
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  
  return await res.json(); // user data
}

export default checkAuth;