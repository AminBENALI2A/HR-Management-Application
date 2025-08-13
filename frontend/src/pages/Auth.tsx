import React, { useState } from 'react';

interface LoginResponse {
  message: string;
  status: {
    access_token: string;
    user: {
      nom: string;
      prenom: string;
      email: string;
      role: string;
    };
  };
}

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // State to toggle between login and forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // For forgot password email input and messages
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  // Login form submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include', // VERY important
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Login failed');
      }

      const res: LoginResponse = await response.json();
      const data = res.status;

      console.log('User logged in:', data);
      // Redirect based on role (example)
      if (data.user.role === 'Super Admin') {
        console.log('Admin logged in');
      } else {
        console.log('User logged in');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password submit handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setError(null);
    setForgotLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to send reset email');
      }

      const data = await response.json();
      setForgotMessage(data.message || 'Check your email for reset instructions.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      {!showForgotPassword ? (
        <>
          <h2 className="mb-4 text-center">Login</h2>
          <form onSubmit={handleLoginSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <button
              className="btn btn-link"
              onClick={() => {
                setShowForgotPassword(true);
                setError(null);
                setForgotMessage(null);
              }}
            >
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="mb-4 text-center">Forgot Password</h2>
          <form onSubmit={handleForgotSubmit}>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {forgotMessage && (
              <div className="alert alert-success" role="alert">
                {forgotMessage}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="forgotEmail" className="form-label">
                Enter your email address
              </label>
              <input
                type="email"
                id="forgotEmail"
                className="form-control"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                required
                disabled={forgotLoading}
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={forgotLoading}>
              {forgotLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <button
              className="btn btn-link"
              onClick={() => {
                setShowForgotPassword(false);
                setError(null);
                setForgotMessage(null);
              }}
            >
              Back to Login
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Auth;
