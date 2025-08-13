import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { withAuth } from '../hoc/withAuth';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
}

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Example user to test frontend
    const exampleUser: User = {
      id: Number(id),
      firstName: "first",
      lastName: "Benali",
      email: "amine.benali@example.com",
      role: "Admin",
      active: true,
    };
    setUser(exampleUser);
    setFirstName(exampleUser.firstName);
    setLastName(exampleUser.lastName);
    setEmail(exampleUser.email);
    setRole(exampleUser.role);
    setActive(exampleUser.active);
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName || !lastName || !email || !role) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);

    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('User updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-5">Loading user...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Edit User</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">First Name</label>
          <input
            id="firstName"
            type="text"
            className="form-control"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            required
          >
            <option value="User">User</option>
            <option value="Manager">Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            id="active"
            type="checkbox"
            className="form-check-input"
            checked={active}
            onChange={e => setActive(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="active" className="form-check-label">
            Active
          </label>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="mt-3 text-center">
        <Link to="/users" className="btn btn-link">
          Back to Users List
        </Link>
      </div>
    </div>
  );
};

export default withAuth(EditUser);
