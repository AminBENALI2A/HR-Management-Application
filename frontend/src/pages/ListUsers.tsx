import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { withAuth } from '../hoc/withAuth';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  active: boolean;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'GET',
        credentials: 'include', // <--- important
      });
      if (!res.ok) throw new Error('Failed to load users');

      const data = await res.json();
      console.log('Fetched users:', data);
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ active: !active }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Error updating status');
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.nom.toLowerCase().includes(filter.toLowerCase()) ||
      u.prenom.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 300 }}
          placeholder="Filter users..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          disabled={loading}
        />
        <Link to="/users/create" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom et Prénom</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.prenom} {user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.active ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-secondary">Inactive</span>
                  )}
                </td>
                <td>
                  <Link
                    to={`/users/edit/${user.id}`}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className={`btn btn-sm ${user.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                    onClick={() => handleToggleActive(user.id, user.active)}
                  >
                    {user.active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="mt-3 text-center">
        <Link to="/dashboard" className="btn btn-link">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default withAuth(UsersList);
