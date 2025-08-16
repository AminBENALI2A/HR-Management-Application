import React, { useState, useEffect } from "react";
import { withAuth } from "../hoc/withAuth";
import CreateUserForm from "./CreateUserForm";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateEmail, validateName, validatePhone } from "../utils/validators";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  active: boolean;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");

  // Hook for edit form validation
  const {
    values: editForm,
    errors,
    handleChange,
    setValues
  } = useFormValidation(
    {
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      role: ""
    },
    (values) => {
      const newErrors: Partial<Record<keyof typeof values, string>> = {};

      if (!values.prenom || !validateName(values.prenom)) {
        newErrors.prenom = "Invalid first name";
      }
      if (!values.nom || !validateName(values.nom)) {
        newErrors.nom = "Invalid last name";
      }
      if (!values.email || !validateEmail(values.email)) {
        newErrors.email = "Invalid email";
      }
      if (!values.telephone || !validatePhone(values.telephone)) {
        newErrors.telephone = "Invalid phone";
      }

      return newErrors;
    }
  );

  // Derived: form is valid if there are no errors
  const isValid = Object.keys(errors).length === 0;

  // Derived: reset form manually
  const resetForm = () => {
    setValues({
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
      role: ""
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://d1pc059cxwtfw0.cloudfront.net/api/users`, {
        credentials: "include",
        referrerPolicy: "unsafe-url" 
      });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();

      const sortedUsers = [...data.users].sort((a, b) => {
        // Sort by active first (true before false)
        if (a.active !== b.active) return a.active ? -1 : 1;

        // Then by nom (case-insensitive)
        const nomCompare = a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" });
        if (nomCompare !== 0) return nomCompare;

        // Finally by prenom (case-insensitive)
        return a.prenom.localeCompare(b.prenom, "fr", { sensitivity: "base" });
      });

      setUsers(sortedUsers);
    } catch (err: any) {
      setError(err.message || "Error loading users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (email: string, active: boolean) => {
    try {
      const res = await fetch(`https://d1pc059cxwtfw0.cloudfront.net/api/users/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "unsafe-url",
        credentials: "include",
        body: JSON.stringify({ email: email , active: !active })
      });
      if (!res.ok) throw new Error("Failed to update status");
      console.log("User status updated successfully");
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Error updating status");
    }
  };

  const handleEditClick = (user: User) => {
    setEditUserId(user.id);
    setValues(user);
  };

  const handleSave = async () => {
    if (!isValid) return;
    try {
      const res = await fetch(`https://d1pc059cxwtfw0.cloudfront.net/api/users/editUser`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        referrerPolicy: "unsafe-url",
        body: JSON.stringify(editForm)
      });
      if (!res.ok) throw new Error("Failed to save changes");
      setEditUserId(null);
      resetForm();
      fetchUsers();
      //console.log(await res.json());
    } catch (err: any) {
      setError(err.message || "Error saving changes");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.nom.toLowerCase().includes(filter.toLowerCase()) ||
      u.prenom.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase()) ||
      u.role.toLowerCase().includes(filter.toLowerCase())) &&
      (roleFilter ? u.role === roleFilter : true) &&
      (activeFilter ? u.active === (activeFilter === "active") : true)
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">User Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {showCreateModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: "400px" }}>
            <h4 className="mb-3">Create User</h4>
            <CreateUserForm
              onSuccess={() => {
                setShowCreateModal(false);
                fetchUsers();
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 300 }}
            placeholder="Filter users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={loading || editUserId !== null}
          />
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            onChange={(e) => setRoleFilter(e.target.value)}
            disabled={loading || editUserId !== null}
          >
            <option value="">All Roles</option>
            <option value="Ressource">Ressource</option>
            <option value="Gestionnaire">Gestionnaire</option>
            <option value="Super Admin">Super Admin</option>
          </select>
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            onChange={(e) => setActiveFilter(e.target.value)}
            disabled={loading || editUserId !== null}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

        </div>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)} disabled={loading || editUserId !== null}>
          + Add User
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom et Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <React.Fragment key={user.id}>
                <tr>
                  <td>{user.nom} {user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.telephone}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(user)}
                      disabled={editUserId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${user.active ? "btn-outline-danger" : "btn-outline-success"}`}
                      onClick={() => handleToggleActive(user.email, user.active)}
                      disabled={editUserId !== null}
                    >
                      {user.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>

                {editUserId === user.id && (
                  <tr>
                    <td colSpan={6}>
                      <div className="p-3 border rounded bg-light">
                        <div className="mb-2">
                          <label className="form-label">Prénom</label>
                          <input
                            type="text"
                            name="prenom"
                            className={`form-control ${errors.prenom ? "is-invalid" : ""}`}
                            value={editForm.prenom || ""}
                            onChange={handleChange}
                          />
                          {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Nom</label>
                          <input
                            type="text"
                            name="nom"
                            className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                            value={editForm.nom || ""}
                            onChange={handleChange}
                          />
                          {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            value={editForm.email || ""}
                            onChange={handleChange}
                            disabled={true}
                          />
                          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Téléphone</label>
                          <input
                            type="text"
                            name="telephone"
                            className={`form-control ${errors.telephone ? "is-invalid" : ""}`}
                            value={editForm.telephone || ""}
                            onChange={handleChange}
                          />
                          {errors.telephone && <div className="invalid-feedback">{errors.telephone}</div>}
                        </div>
                        <div className="mb-2">
                          <label htmlFor="role" className="form-label">Role</label>
                          <select
                            id="role"
                            name="role"
                            className={`form-select`}
                            value={editForm.role || "User"}
                            onChange={handleChange}
                          >
                            <option value="Ressource">Ressource</option>
                            <option value="Gestionnaire">Gestionnaire</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        
                        </div>

                        <div className="mt-3">
                          <button
                            className="btn btn-success me-2"
                            onClick={handleSave}
                            disabled={!isValid}
                          >
                            Save
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => { setEditUserId(null); resetForm(); }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withAuth(UsersList);
