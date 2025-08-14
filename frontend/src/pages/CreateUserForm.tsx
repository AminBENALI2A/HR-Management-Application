import React from "react";
import { withAuth } from "../hoc/withAuth";
import { useFormValidation } from "../hooks/useFormValidation";
import { validateEmail, validateName, validatePhone } from "../utils/validators";

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
  const { values, errors, handleChange, handleSubmit} = useFormValidation(
    { firstName: "", lastName: "", email: "", phone: "", role: "Ressource" },
    (vals) => {
      const errs: Record<string, string> = {};
      if (!validateName(vals.firstName)) errs.firstName = "Invalid first name.";
      if (!validateName(vals.lastName)) errs.lastName = "Invalid last name.";
      if (!validateEmail(vals.email)) errs.email = "Invalid email address.";
      if (!validatePhone(vals.phone)) errs.phone = "Invalid phone number.";
      return errs;
    }
  );

  const [loading, setLoading] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const submitForm = async () => {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          prenom: values.firstName,
          nom: values.lastName,
          email: values.email,
          telephone: values.phone,
          role: values.role,
        }),
      });

      if (!res.ok) throw new Error("Failed to create user");
      onSuccess();
    } catch (err: any) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)}>
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      {/* First Name */}
      <div className="mb-2">
        <label className="form-label">First Name</label>
        <input
          name="firstName"
          className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          value={values.firstName}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
      </div>

      {/* Last Name */}
      <div className="mb-2">
        <label className="form-label">Last Name</label>
        <input
          name="lastName"
          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          value={values.lastName}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
      </div>

      {/* Email */}
      <div className="mb-2">
        <label className="form-label">Email</label>
        <input
          name="email"
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          value={values.email}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/* Telephone */}
      <div className="mb-2">
        <label className="form-label">Telephone</label>
        <input
          name="phone"
          className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          value={values.phone}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
      </div>

      {/* Role */}
      <div className="mb-2">
        <label className="form-label">Role</label>
        <select
          name="role"
          className="form-select"
          value={values.role}
          onChange={handleChange}
          disabled={loading}
        >
          <option>Ressource</option>
          <option>Gestionnaire</option>
          <option>Admin</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-3 d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default withAuth(CreateUserForm);
