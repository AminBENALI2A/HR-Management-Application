import React, { useState, useEffect } from "react";
import { withAuth } from "../../hoc/withAuth";
import CreatePartenaireForm from "./CreatePartnerForm";
import { useFormValidation } from "../../hooks/useFormValidation";
import { validateEmail, validateName, validatePhone } from "../../utils/validators";
import { API_BASE_URL } from "../../utils/config";

interface Contact {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: string;
  direction: string;
  departement: string;
}

interface Partenaire {
  id: number;
  nomCompagnie: string;
  siren: string;
  numeroTva: string;
  contacts: Contact[];
  activites: string[];
  adresse?: string;
  active: boolean;
  dateCreation: string;
  dateModification: string;
}

const PartenairesList: React.FC = () => {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editPartenaireId, setEditPartenaireId] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Hook for edit form validation
  const {
    values: editForm,
    errors,
    handleChange,
    setValues
  } = useFormValidation(
    {
      nomCompagnie: "",
      siren: "",
      numeroTva: "",
      contacts: [{ nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" }],
      activites: [""],
      adresse: ""
    },
    (values) => {
      const newErrors: any = {};
  
      if (!values.nomCompagnie || !validateName(values.nomCompagnie)) {
        newErrors.nomCompagnie = "Invalid company name";
      }
      if (!values.siren) {
        newErrors.siren = "SIREN is required";
      }
      if (!values.numeroTva) {
        newErrors.numeroTva = "Numéro TVA is required";
      }
  
      // Validate contacts
      if (!values.contacts || values.contacts.length === 0) {
        newErrors.contacts = "At least one contact is required";
      } else {
        const validContacts = values.contacts.filter((contact: Contact) => 
          contact.nom || contact.prenom || contact.email
        );
        if (validContacts.length === 0) {
          newErrors.contacts = "At least one contact with name or email is required";
        }
        
        values.contacts.forEach((contact: Contact, index: number) => {
          if (contact.email && !validateEmail(contact.email)) {
            newErrors[`contact_email_${index}`] = "Invalid email";
          }
          if (contact.telephone && !validatePhone(contact.telephone)) {
            newErrors[`contact_phone_${index}`] = "Invalid phone";
          }
        });
      }
  
      // Validate activities
      const validActivities = values.activites.filter((act: string) => act.trim());
      if (validActivities.length === 0) {
        newErrors.activites = "At least one activity is required";
      }
  
      return newErrors;
    }
  );

  // Derived: form is valid if there are no errors
  const isValid = Object.keys(errors).length === 0;

  // Toggle row expansion
  const toggleRowExpansion = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  // Functions to manage dynamic contacts
  const addContact = () => {
    const newContacts = [...editForm.contacts, { nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" }];
    setValues({ ...editForm, contacts: newContacts });
  };

  const removeContact = (index: number) => {
    if (editForm.contacts.length > 1) {
      const newContacts = editForm.contacts.filter((_: Contact, i: number) => i !== index);
      setValues({ ...editForm, contacts: newContacts });
    }
  };

  const updateContact = (index: number, field: string, value: string) => {
    const newContacts = [...editForm.contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setValues({ ...editForm, contacts: newContacts });
  };

  // Functions to manage dynamic activities
  const addActivity = () => {
    const newActivites = [...editForm.activites, ""];
    setValues({ ...editForm, activites: newActivites });
  };

  const removeActivity = (index: number) => {
    if (editForm.activites.length > 1) {
      const newActivites = editForm.activites.filter((_: string, i: number) => i !== index);
      setValues({ ...editForm, activites: newActivites });
    }
  };

  const updateActivity = (index: number, value: string) => {
    const newActivites = [...editForm.activites];
    newActivites[index] = value;
    setValues({ ...editForm, activites: newActivites });
  };

  // Derived: reset form manually
  const resetForm = () => {
    setValues({
      nomCompagnie: "",
      siren: "",
      numeroTva: "",
      contacts: [{ nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" }],
      activites: [""],
      adresse: ""
    });
  };

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const fetchPartenaires = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/partenaires`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load partenaires");
      const data = await res.json();
      console.log("Fetched partenaires:", data.partenaires);

      const sortedPartenaires = [...data.partenaires].sort((a, b) => {
        // Sort by active first (true before false)
        if (a.active !== b.active) return a.active ? -1 : 1;

        // Then by company name (case-insensitive)
        return a.nomCompagnie.localeCompare(b.nomCompagnie, "fr", { sensitivity: "base" });
      });

      setPartenaires(sortedPartenaires);
    } catch (err: any) {
      setError(err.message || "Error loading partenaires");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (siren: string, active: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/partenaires/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ siren: siren, active: !active })
      });
      if (!res.ok) throw new Error("Failed to update status");
      console.log("Partenaire status updated successfully");
      fetchPartenaires();
    } catch (err: any) {
      setError(err.message || "Error updating status");
    }
  };

  const handleEditClick = (partenaire: Partenaire) => {
    setEditPartenaireId(partenaire.id);
    setValues({
      nomCompagnie: partenaire.nomCompagnie,
      siren: partenaire.siren,
      numeroTva: partenaire.numeroTva,
      contacts: partenaire.contacts.length > 0 ? partenaire.contacts : [{ nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" }],
      activites: partenaire.activites.length > 0 ? partenaire.activites : [""],
      adresse: partenaire.adresse ?? ""
    });
  };

  const handleSave = async () => {
    if (!isValid) return;
    try {
      const res = await fetch(`${API_BASE_URL}/partenaires/editPartenaire`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: String(editPartenaireId),
          ...editForm,
          // Filter out empty contacts and activities
          contacts: editForm.contacts.filter((c: Contact) => c.nom || c.prenom || c.email),
          activites: editForm.activites.filter((a: string) => a.trim())
        })
      });
      console.log("Saving changes for partenaire", JSON.stringify({
          id: editPartenaireId,
          ...editForm,
          // Filter out empty contacts and activities
          contacts: editForm.contacts.filter((c: Contact) => c.nom || c.prenom || c.email),
          activites: editForm.activites.filter((a: string) => a.trim())
        }));
      if (!res.ok) throw new Error("Failed to save changes");
      setEditPartenaireId(null);
      resetForm();
      fetchPartenaires();
    } catch (err: any) {
      setError(err.message || "Error saving changes");
    }
  };

  // Get unique activities for filter
  const allActivities = Array.from(new Set(partenaires.flatMap(p => p.activites)));

  const filteredPartenaires = partenaires.filter((p) => {
    const searchText = filter.toLowerCase();
    const matchesSearch = 
      p.nomCompagnie.toLowerCase().includes(searchText) ||
      p.siren.toLowerCase().includes(searchText) ||
      p.numeroTva.toLowerCase().includes(searchText) ||
      (p.adresse && p.adresse.toLowerCase().includes(searchText)) ||
      p.contacts.some(c => 
        c.nom.toLowerCase().includes(searchText) ||
        c.prenom.toLowerCase().includes(searchText) ||
        c.email.toLowerCase().includes(searchText) ||
        c.role.toLowerCase().includes(searchText)
      ) ||
      p.activites.some(a => a.toLowerCase().includes(searchText));

    const matchesActivity = activityFilter ? p.activites.includes(activityFilter) : true;
    const matchesActive = activeFilter ? p.active === (activeFilter === "active") : true;

    return matchesSearch && matchesActivity && matchesActive;
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Partenaire Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {showCreateModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <h4 className="mb-3">Create Partenaire</h4>
            <CreatePartenaireForm
              onSuccess={() => {
                setShowCreateModal(false);
                fetchPartenaires();
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
            placeholder="Filter partenaires..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disabled={loading || editPartenaireId !== null}
          />
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            disabled={loading || editPartenaireId !== null}
          >
            <option value="">All Activities</option>
            {allActivities.map(activity => (
              <option key={activity} value={activity}>{activity}</option>
            ))}
          </select>
          <select
            className="form-select"
            style={{ maxWidth: 200 }}
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            disabled={loading || editPartenaireId !== null}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowCreateModal(true)} 
          disabled={loading || editPartenaireId !== null}
        >
          + Add Partenaire
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
              <th>Company</th>
              <th>SIREN</th>
              <th>Status</th>
              <th>Creation Date</th>
              <th style={{ width: 200 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPartenaires.map((partenaire) => (
              <React.Fragment key={partenaire.id}>
                {/* Main Row */}
                <tr 
                  style={{ cursor: "pointer" }}
                  onClick={() => !editPartenaireId && toggleRowExpansion(partenaire.id)}
                >
                  <td className="text-center">
                    <span className="text-muted">
                      {expandedRows.has(partenaire.id) ? '▼' : '▶'}
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong>{partenaire.nomCompagnie}</strong>
                      <div className="text-muted small mt-1">
                        <strong>Activities:</strong>{' '}
                        <span className="d-inline-flex flex-wrap gap-1">
                          {partenaire.activites.slice(0, 3).map((activity, idx) => (
                            <span key={idx} className="badge bg-primary small">{activity}</span>
                          ))}
                          {partenaire.activites.length > 3 && (
                            <span className="badge bg-secondary small">+{partenaire.activites.length - 3}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{partenaire.siren}</td>
                  <td>
                    {partenaire.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td className="text-muted small">
                    {new Date(partenaire.dateCreation).toLocaleDateString()}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(partenaire)}
                      disabled={editPartenaireId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${partenaire.active ? "btn-outline-danger" : "btn-outline-success"}`}
                      onClick={() => handleToggleActive(partenaire.siren, partenaire.active)}
                      disabled={editPartenaireId !== null}
                    >
                      {partenaire.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedRows.has(partenaire.id) && (
                  <tr>
                    <td></td>
                    <td colSpan={5}>
                      <div className="p-3 border rounded bg-light">
                        {/* Four columns in one row */}
                        <div className="row mb-3">
                          <div className="col-md-3">
                            <strong className="text-muted small">VAT NUMBER</strong>
                            <div>{partenaire.numeroTva}</div>
                          </div>
                          <div className="col-md-3">
                            <strong className="text-muted small">CREATION DATE</strong>
                            <div>{new Date(partenaire.dateCreation).toLocaleDateString()}</div>
                          </div>
                          <div className="col-md-3">
                            <strong className="text-muted small">LAST MODIFIED</strong>
                            <div>{new Date(partenaire.dateModification).toLocaleDateString()}</div>
                          </div>
                          <div className="col-md-3">
                            <strong className="text-muted small">ADDRESS</strong>
                            <div>{partenaire.adresse || 'N/A'}</div>
                          </div>
                        </div>

                        {/* Contacts as list */}
                        <div className="mb-3">
                          <strong className="text-muted small">CONTACTS ({partenaire.contacts.length})</strong>
                          <ul className="list-unstyled mt-2 mb-0">
                            {partenaire.contacts.map((contact, idx) => (
                              <li key={idx} className="mb-2 pb-2 border-bottom">
                                <div className="fw-semibold">
                                  {contact.prenom} {contact.nom}
                                  {contact.role && <span className="text-muted"> - {contact.role}</span>}
                                </div>
                                <div className="text-muted small">
                                  {contact.email && <span className="me-3">{contact.email}</span>}
                                  {contact.telephone && <span className="me-3">{contact.telephone}</span>}
                                  {(contact.direction || contact.departement) && (
                                    <span>{[contact.direction, contact.departement].filter(Boolean).join(" - ")}</span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Edit Form Row */}
                {editPartenaireId === partenaire.id && (
                  <tr>
                    <td></td>
                    <td colSpan={5}>
                      <div className="p-3 border rounded bg-light">
                        <h6 className="mb-3">Edit Partenaire</h6>
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <label className="form-label">Company Name</label>
                            <input
                              type="text"
                              name="nomCompagnie"
                              className={`form-control ${errors.nomCompagnie ? "is-invalid" : ""}`}
                              value={editForm.nomCompagnie || ""}
                              onChange={handleChange}
                            />
                            {errors.nomCompagnie && <div className="invalid-feedback">{errors.nomCompagnie}</div>}
                          </div>
                          <div className="col-md-3 mb-2">
                            <label className="form-label">SIREN</label>
                            <input
                              type="text"
                              name="siren"
                              className={`form-control ${errors.siren ? "is-invalid" : ""}`}
                              value={editForm.siren || ""}
                              onChange={handleChange}
                            />
                            {errors.siren && <div className="invalid-feedback">{errors.siren}</div>}
                          </div>
                          <div className="col-md-3 mb-2">
                            <label className="form-label">VAT Number</label>
                            <input
                              type="text"
                              name="numeroTva"
                              className={`form-control ${errors.numeroTva ? "is-invalid" : ""}`}
                              value={editForm.numeroTva || ""}
                              onChange={handleChange}
                            />
                            {errors.numeroTva && <div className="invalid-feedback">{errors.numeroTva}</div>}
                          </div>
                        </div>

                        <div className="mb-2">
                          <label className="form-label">Address</label>
                          <textarea
                            name="adresse"
                            className="form-control"
                            rows={2}
                            value={editForm.adresse || ""}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Contacts Section */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Contacts</label>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addContact}>
                              + Add Contact
                            </button>
                          </div>
                          {editForm.contacts.map((contact: Contact, index: number) => (
                            <div key={index} className="border p-2 mb-2 rounded">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted">Contact {index + 1}</small>
                                {editForm.contacts.length > 1 && (
                                  <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeContact(index)}
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                              <div className="row">
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="form-control form-control-sm"
                                    value={contact.nom}
                                    onChange={(e) => updateContact(index, 'nom', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    placeholder="First Name"
                                    className="form-control form-control-sm"
                                    value={contact.prenom}
                                    onChange={(e) => updateContact(index, 'prenom', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control form-control-sm"
                                    value={contact.email}
                                    onChange={(e) => updateContact(index, 'email', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-3">
                                  <input
                                    type="text"
                                    placeholder="Phone"
                                    className="form-control form-control-sm"
                                    value={contact.telephone}
                                    onChange={(e) => updateContact(index, 'telephone', e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="row mt-2">
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    placeholder="Role"
                                    className="form-control form-control-sm"
                                    value={contact.role}
                                    onChange={(e) => updateContact(index, 'role', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    placeholder="Direction"
                                    className="form-control form-control-sm"
                                    value={contact.direction}
                                    onChange={(e) => updateContact(index, 'direction', e.target.value)}
                                  />
                                </div>
                                <div className="col-md-4">
                                  <input
                                    type="text"
                                    placeholder="Department"
                                    className="form-control form-control-sm"
                                    value={contact.departement}
                                    onChange={(e) => updateContact(index, 'departement', e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          {errors.contacts && <div className="text-danger small">{errors.contacts}</div>}
                        </div>

                        {/* Activities Section */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Activities</label>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addActivity}>
                              + Add Activity
                            </button>
                          </div>
                          {editForm.activites.map((activity: string, index: number) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                              <input
                                type="text"
                                placeholder="Activity (e.g., Banking, Insurance)"
                                className="form-control"
                                value={activity}
                                onChange={(e) => updateActivity(index, e.target.value)}
                              />
                              {editForm.activites.length > 1 && (
                                <button 
                                  type="button" 
                                  className="btn btn-outline-danger"
                                  onClick={() => removeActivity(index)}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                          {errors.activites && <div className="text-danger small">{errors.activites}</div>}
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
                            onClick={() => { setEditPartenaireId(null); resetForm(); }}
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

            {filteredPartenaires.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center">
                  No partenaires found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default withAuth(PartenairesList);