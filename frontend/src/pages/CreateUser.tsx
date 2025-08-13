import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { withAuth } from "../hoc/withAuth";

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName || !lastName || !email || !role) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      // Example API call
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create user");
      }

      navigate("/users");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h2 className="mb-4 text-center">Create User</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="firstName">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
            placeholder="Enter first name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="lastName">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
            placeholder="Enter last name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="role">
            Role
          </label>
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

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Creating..." : "Create User"}
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

export default withAuth(CreateUser);
