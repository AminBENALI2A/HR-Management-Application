
async function checkAuth() {
  const res = await fetch('http://localhost:3000/auth/session', {
    credentials: 'include', // sends the cookie to backend
  });
  
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  
  return await res.json(); // user data
}

export default checkAuth;