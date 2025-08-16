
async function checkAuth() {
  const res = await fetch('https://d1pc059cxwtfw0.cloudfront.net/auth/session', {
    credentials: 'include', // sends the cookie to backend
  });
  
  if (!res.ok) {
    throw new Error('Unauthorized');
  }
  
  return await res.json(); // user data
}

export default checkAuth;