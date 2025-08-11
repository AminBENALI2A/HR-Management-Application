import React, { useState } from 'react';

const Auth: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle authentication logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-5" style={{ maxWidth: '400px' }}>
  <div className="mb-3">
    <label htmlFor="username" className="form-label">Username:</label>
    <input
      id="username"
      type="text"
      className="form-control"
      value={username}
      onChange={e => setUsername(e.target.value)}
      required
    />
  </div>

  <div className="mb-3">
    <label htmlFor="password" className="form-label">Password:</label>
    <input
      id="password"
      type="password"
      className="form-control"
      value={password}
      onChange={e => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit" className="btn btn-primary w-100">Login</button>
</form>
    );
};

export default Auth;