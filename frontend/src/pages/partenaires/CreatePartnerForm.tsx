import React, { useState, useCallback, useMemo } from "react";
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

interface CreatePartnerFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface PartnerFormData {
  nomCompagnie: string;
  siren: string;
  numeroTva: string;
  contacts: Contact[];
  activites: string[];
  adresse: string;
}

type PartnerFormErrors = {
  nomCompagnie?: string;
  siren?: string;
  numeroTva?: string;
  contacts?: string;
  activites?: string;
  adresse?: string;
  [key: string]: string | undefined;
};

const CreatePartnerForm: React.FC<CreatePartnerFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Fonctions utilitaires pour la validation - MÊME LOGIQUE PARTOUT
  const getValidContacts = (contacts: Contact[]) => {
    return contacts.filter((c) => 
        c.nom?.trim() && 
        c.prenom?.trim() && 
        (c.email?.trim() || c.telephone?.trim())
    );
};

  const getValidActivities = (activities: string[]) => {
    return activities.filter((a) => a.trim().length > 0);
  };

  // Validation du formulaire avec suppression correcte des erreurs globales
const validateForm = useCallback((values: PartnerFormData) => {
  const newErrors: PartnerFormErrors = {};

  // Nom société
  if (!values.nomCompagnie.trim()) {
    newErrors.nomCompagnie = "Company name is required";
  } else if (values.nomCompagnie.trim().length < 2) {
    newErrors.nomCompagnie = "Company name must be at least 2 characters";
  } else if (!validateName(values.nomCompagnie)) {
    newErrors.nomCompagnie = "Company name contains invalid characters";
  }

  // SIREN (9 chiffres)
  if (!values.siren.trim()) {
    newErrors.siren = "SIREN number is required";
  } else if (!/^\d{9}$/.test(values.siren.trim())) {
    newErrors.siren = "SIREN must be exactly 9 digits";
  }

  // TVA (FR + 2 chars + 9 chiffres)
  if (!values.numeroTva.trim()) {
    newErrors.numeroTva = "VAT number is required";
  } else if (!/^FR[0-9A-Z]{2}\d{9}$/.test(values.numeroTva.trim().toUpperCase())) {
    newErrors.numeroTva = "VAT number must be in format FR + 2 chars + 9 digits (e.g., FRXX123456789)";
  }

  // Contacts - validation globale ET individuelle
  const validContacts = getValidContacts(values.contacts);
  
  // IMPORTANT: Ajouter l'erreur globale seulement si aucun contact valide
  if (validContacts.length === 0) {
    newErrors.contacts = "At least one contact with full name and email or phone is required";
  }
  // SINON: ne pas ajouter l'erreur (elle sera supprimée automatiquement)

  // Validation individuelle des contacts
  values.contacts.forEach((contact, index) => {
    const hasAnyData = contact.nom.trim() || contact.prenom.trim() || contact.email.trim() || contact.telephone.trim();
    
    if (hasAnyData) {
      if (contact.nom.trim() && !validateName(contact.nom)) {
        newErrors[`contact_${index}_nom`] = "Please enter a valid last name";
      }

      if (contact.prenom.trim() && !validateName(contact.prenom)) {
        newErrors[`contact_${index}_prenom`] = "Please enter a valid first name";
      }

      if (contact.email.trim() && !validateEmail(contact.email)) {
        newErrors[`contact_${index}_email`] = "Please enter a valid email address";
      }

      if (contact.telephone.trim() && !validatePhone(contact.telephone.trim())) {
        newErrors[`contact_${index}_telephone`] = "Phone must be in E.164 format (+[country code][number])";
      }

      const hasBasicInfo = contact.nom.trim() && contact.prenom.trim();
      if (!hasBasicInfo && (!contact.email.trim() || !contact.telephone.trim())) {
        newErrors[`contact_${index}_nom`] = "Please provide at least full name and email or phone";
      }
    }
  });

  // Activités - validation globale ET individuelle
  const validActivities = getValidActivities(values.activites);
  // IMPORTANT: Ajouter l'erreur globale seulement si aucune activité valide
  if (validActivities.length === 0) {
    newErrors.activites = "At least one activity is required";
  }
  // SINON: ne pas ajouter l'erreur (elle sera supprimée automatiquement)

  // Validation individuelle des activités
  values.activites.forEach((activity, index) => {
    if (!validateName(activity)) {
      newErrors.activites = "Please enter at least one valid activity";
      newErrors[`activity ${index+1}`] = "Activity not valid";
    }
  });

  return newErrors;
}, []);

  const {
    values: formData,
    errors,
    handleChange,
    setValues,
  }: {
    values: PartnerFormData;
    errors: PartnerFormErrors;
    handleChange: (e: React.ChangeEvent<any>) => void;
    setValues: (values: PartnerFormData) => void;
  } = useFormValidation<PartnerFormData>(
    {
      nomCompagnie: "",
      siren: "",
      numeroTva: "",
      contacts: [
        { nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" },
      ],
      activites: [""],
      adresse: "",
    },
    validateForm
  );

  // Touch management
  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    handleChange(e);
    setTouched((prev) => ({ ...prev, [name]: true }));
  };
const validateContact = (contact: Contact): boolean => {
  // Validate required fields
  if (!validateName(contact.nom)) return false;
  if (!validateName(contact.prenom)) return false;
  if (!contact.email && !contact.telephone) return false;
  // Validate email format if provided
  if (contact.email && !validateEmail(contact.email)) return false;
  
  // Validate phone if provided
  if (contact.telephone && !validatePhone(contact.telephone)) return false;

  return true;
};
  // États de validation - MÊME LOGIQUE que dans validateForm
const hasValidContacts = useMemo(() => {
  const validContacts = getValidContacts(formData.contacts);
  return validContacts.length > 0 && validContacts.every(contact => 
    validateContact(contact) // Assuming you have a `validateContact` function
  );
}, [formData.contacts, validateContact,formData.contacts.map(c => [c.nom, c.prenom, c.telephone, c.email].join(',')).join(',')]); // Only the array reference is needed


const hasValidActivities = useMemo(() => {
  const validActivities = getValidActivities(formData.activites);
  return validActivities.length > 0 && validActivities.every(activity => validateName(activity));
}, [formData.activites.join(',')]); // Note the quotes around the comma

  // Vérification de validité globale
  const isValid = useMemo(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const hasContacts = getValidContacts(formData.contacts).length > 0;
    const hasActivities = getValidActivities(formData.activites).length > 0;
    
    return !hasErrors && hasContacts && hasActivities;
  }, [
    errors, 
    formData.contacts,  // Using full array instead of memoized value
    formData.activites  // Using full array instead of memoized value
  ]);
  // Manage contacts
  const addContact = () => {
    const newContacts = [
      ...formData.contacts,
      { nom: "", prenom: "", email: "", telephone: "", role: "", direction: "", departement: "" },
    ];
    setValues({ ...formData, contacts: newContacts });
  };

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      const newContacts = formData.contacts.filter((_, i) => i !== index);
      setValues({ ...formData, contacts: newContacts });

      const newTouched = { ...touched };
      Object.keys(newTouched).forEach((key) => {
        if (key.startsWith(`contact_${index}_`)) {
          delete newTouched[key];
        }
      });
      
      const reindexedTouched = { ...newTouched };
      Object.keys(newTouched).forEach((key) => {
        const match = key.match(/^contact_(\d+)_(.+)$/);
        if (match) {
          const contactIndex = parseInt(match[1]);
          const field = match[2];
          if (contactIndex > index) {
            delete reindexedTouched[key];
            reindexedTouched[`contact_${contactIndex - 1}_${field}`] = newTouched[key];
          }
        }
      });
      
      setTouched(reindexedTouched);
    }
  };
//update
  const updateContact = (index: number, field: string, value: string) => {
  
  // Create a synthetic event for handleChange
  const fieldName = `contacts[${index}].${field}`;
  handleChange({
    target: {
      name: fieldName,
      value: value
    }
  } as React.ChangeEvent<HTMLInputElement>);
  
  setTouched((prev) => ({ ...prev, [`contact_${index}_${field}`]: true }));
};
  const handleContactBlur = (index: number, field: string) => {
    setTouched((prev) => ({ ...prev, [`contact_${index}_${field}`]: true }));
  };

  // Manage activities
  const addActivity = () => {
    setValues({ ...formData, activites: [...formData.activites, ""] });
  };

  const removeActivity = (index: number) => {
    if (formData.activites.length > 1) {
      setValues({ 
        ...formData, 
        activites: formData.activites.filter((_, i) => i !== index) 
      });
      
      const newTouched = { ...touched };
      Object.keys(newTouched).forEach((key) => {
        if (key.startsWith(`activity_${index}`)) {
          delete newTouched[key];
        }
      });
      
      const reindexedTouched = { ...newTouched };
      Object.keys(newTouched).forEach((key) => {
        const match = key.match(/^activity_(\d+)$/);
        if (match) {
          const activityIndex = parseInt(match[1]);
          if (activityIndex > index) {
            delete reindexedTouched[key];
            reindexedTouched[`activity_${activityIndex - 1}`] = newTouched[key];
          }
        }
      });
      
      setTouched(reindexedTouched);
    }
  };

  const updateActivity = (index: number, value: string) => {
  
  // Create a synthetic event for handleChange
  const fieldName = `activites[${index}]`; // Note: "activites" spelling must match your form state
  handleChange({
    target: {
      name: fieldName,
      value: value
    }
  } as React.ChangeEvent<HTMLInputElement>);
  
  setTouched((prev) => ({ ...prev, [`activity_${index}`]: true }));
};

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        numeroTva: formData.numeroTva.toUpperCase(),
        contacts: getValidContacts(formData.contacts).map((c) => ({
          ...c,
          role: c.role.trim() || undefined,
          direction: c.direction.trim() || undefined,
          departement: c.departement.trim() || undefined,
        })),
        activites: getValidActivities(formData.activites),
      };

      console.log('Submitting payload:', payload);

      const res = await fetch(`${API_BASE_URL}/partenaires/addPartenaire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        referrerPolicy: "unsafe-url",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create partner");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error creating partner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger d-flex align-items-center mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Company Name*</label>
          <input
            type="text"
            name="nomCompagnie"
            className={`form-control ${
              touched.nomCompagnie && errors.nomCompagnie ? "is-invalid" : 
              touched.nomCompagnie && !errors.nomCompagnie && formData.nomCompagnie.trim() ? "is-valid" : ""
            }`}
            value={formData.nomCompagnie}
            onChange={handleFieldChange}
            onBlur={() => handleBlur('nomCompagnie')}
            placeholder="Enter company name"
            required
          />
          {touched.nomCompagnie && errors.nomCompagnie && (
            <div className="invalid-feedback">{errors.nomCompagnie}</div>
          )}
          {touched.nomCompagnie && !errors.nomCompagnie && formData.nomCompagnie.trim() && (
            <div className="valid-feedback">Looks good!</div>
          )}
        </div>
        
        <div className="mb-3">
          <label className="form-label">SIREN*</label>
          <input
            type="text"
            name="siren"
            className={`form-control ${
              touched.siren && errors.siren ? "is-invalid" : 
              touched.siren && !errors.siren && formData.siren.trim() ? "is-valid" : ""
            }`}
            value={formData.siren}
            onChange={handleFieldChange}
            onBlur={() => handleBlur('siren')}
            placeholder="9 digits"
            maxLength={9}
            pattern="[0-9]{9}"
            required
          />
          {touched.siren && errors.siren && (
            <div className="invalid-feedback">{errors.siren}</div>
          )}
          <small className="form-text text-muted">9-digit SIREN number</small>
        </div>
        
        <div className="mb-3">
          <label className="form-label">VAT Number*</label>
          <input
            type="text"
            name="numeroTva"
            className={`form-control ${
              touched.numeroTva && errors.numeroTva ? "is-invalid" : 
              touched.numeroTva && !errors.numeroTva && formData.numeroTva.trim() ? "is-valid" : ""
            }`}
            value={formData.numeroTva}
            onChange={handleFieldChange}
            onBlur={() => handleBlur('numeroTva')}
            placeholder="FR12345678901"
            maxLength={13}
            style={{ textTransform: 'uppercase' }}
            required
          />
          {touched.numeroTva && errors.numeroTva && (
            <div className="invalid-feedback">{errors.numeroTva}</div>
          )}
          <small className="form-text text-muted">Format: FR + 11 digits</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            name="adresse"
            className="form-control"
            rows={2}
            value={formData.adresse}
            onChange={handleFieldChange}
            placeholder="Enter company address"
          />
        </div>

        {/* Contacts Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label mb-0">
              Contacts* 
              <span className={`ms-2 badge ${hasValidContacts ? 'bg-success' : 'bg-warning'}`}>
                {formData.contacts.filter(c => c.nom.trim() || c.prenom.trim() || c.email.trim()).length} valid
              </span>
            </label>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addContact}>
              <i className="bi bi-plus"></i> Add Contact
            </button>
          </div>
          
          {formData.contacts.map((contact: Contact, index: number) => (
            <div key={index} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center py-2">
                <small className="text-muted fw-bold">Contact {index + 1}</small>
                {formData.contacts.length > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeContact(index)}
                  >
                    <i className="bi bi-trash"></i> Remove
                  </button>
                )}
              </div>
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <input
                      type="text"
                      placeholder="Last Name*"
                      className={`form-control form-control-sm ${
                        touched[`contact_${index}_nom`] && errors[`contact_${index}_nom`] ? "is-invalid" : 
                        touched[`contact_${index}_nom`] && !errors[`contact_${index}_nom`] && contact.nom.trim() ? "is-valid" : ""
                      }`}
                      value={contact.nom}
                      //appp
                      onChange={(e) => updateContact(index, 'nom', e.target.value)}
                      onBlur={() => handleContactBlur(index, 'nom')}
                    />
                    {touched[`contact_${index}_nom`] && errors[`contact_${index}_nom`] && (
                      <div className="invalid-feedback">{errors[`contact_${index}_nom`]}</div>
                    )}
                  </div>
                  <div className="col-md-3 mb-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      className={`form-control form-control-sm ${
                        touched[`contact_${index}_prenom`] && errors[`contact_${index}_prenom`] ? "is-invalid" : 
                        touched[`contact_${index}_prenom`] && !errors[`contact_${index}_prenom`] && contact.prenom.trim() ? "is-valid" : ""
                      }`}
                      value={contact.prenom}
                      onChange={(e) => updateContact(index, 'prenom', e.target.value)}
                      onBlur={() => handleContactBlur(index, 'prenom')}
                    />
                    {touched[`contact_${index}_prenom`] && errors[`contact_${index}_prenom`] && (
                      <div className="invalid-feedback">{errors[`contact_${index}_prenom`]}</div>
                    )}
                  </div>
                  <div className="col-md-3 mb-2">
                    <input
                      type="email"
                      placeholder="Email*"
                      className={`form-control form-control-sm ${
                        touched[`contact_${index}_email`] && errors[`contact_${index}_email`] ? "is-invalid" : 
                        touched[`contact_${index}_email`] && !errors[`contact_${index}_email`] && contact.email.trim() ? "is-valid" : ""
                      }`}
                      value={contact.email}
                      onChange={(e) => updateContact(index, 'email', e.target.value)}
                      onBlur={() => handleContactBlur(index, 'email')}
                    />
                    {touched[`contact_${index}_email`] && errors[`contact_${index}_email`] && (
                      <div className="invalid-feedback">{errors[`contact_${index}_email`]}</div>
                    )}
                  </div>
                  <div className="col-md-3 mb-2">
                    <input
                      type="tel"
                      placeholder="Phone (+33123456789)"
                      className={`form-control form-control-sm ${
                        touched[`contact_${index}_telephone`] && errors[`contact_${index}_telephone`] ? "is-invalid" : 
                        touched[`contact_${index}_telephone`] && !errors[`contact_${index}_telephone`] && contact.telephone.trim() ? "is-valid" : ""
                      }`}
                      value={contact.telephone}
                      onChange={(e) => updateContact(index, 'telephone', e.target.value)}
                      onBlur={() => handleContactBlur(index, 'telephone')}
                    />
                    {touched[`contact_${index}_telephone`] && errors[`contact_${index}_telephone`] && (
                      <div className="invalid-feedback">{errors[`contact_${index}_telephone`]}</div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <input
                      type="text"
                      placeholder="Role"
                      className="form-control form-control-sm"
                      value={contact.role}
                      onChange={(e) => updateContact(index, 'role', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-2">
                    <input
                      type="text"
                      placeholder="Direction"
                      className="form-control form-control-sm"
                      value={contact.direction}
                      onChange={(e) => updateContact(index, 'direction', e.target.value)}
                    />
                  </div>
                  <div className="col-md-4 mb-2">
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
            </div>
          ))}
          {errors.contacts && <div className="text-danger small"><i className="bi bi-exclamation-circle"></i> {errors.contacts}</div>}
        </div>

        {/* Activities Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <label className="form-label mb-0">
              Activities* 
              <span className={`ms-2 badge ${hasValidActivities ? 'bg-success' : 'bg-warning'}`}>
                {formData.activites.filter(a => a.trim().length > 0).length} valid
              </span>
            </label>
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={addActivity}>
              <i className="bi bi-plus"></i> Add Activity
            </button>
          </div>
          {formData.activites.map((activity: string, index: number) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                placeholder="Activity (e.g., Banking, Insurance, Consulting)"
                className={`form-control ${errors.activites ? "is-invalid" : activity.trim().length >= 3 ? "is-valid" : ""}`}
                value={activity}
                onChange={(e) => updateActivity(index, e.target.value)}
              />
              {formData.activites.length > 1 && (
                <button 
                  type="button" 
                  className="btn btn-outline-danger"
                  onClick={() => removeActivity(index)}
                >
                  Remove
                </button>
              )}
              {errors.activites && index === 0 && (
                <div className="invalid-feedback">{errors.activites}</div>
              )}
            </div>
          ))}
        </div>

        {/* Form Summary */}
        <div className="card mb-4">
          <div className="card-body p-3">
            <h6 className="card-title mb-2">Form Summary</h6>
            <div className="row">
              <div className="col-md-4">
                <small className="text-muted">Company Info:</small>
                <div className={`small ${formData.nomCompagnie.trim() && formData.siren.trim() && formData.numeroTva.trim() ? 'text-success' : 'text-warning'}`}>
                  <i className={`bi ${formData.nomCompagnie.trim() && formData.siren.trim() && formData.numeroTva.trim() ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
                  {formData.nomCompagnie.trim() && formData.siren.trim() && formData.numeroTva.trim() ? ' Complete' : ' Incomplete'}
                </div>
              </div>
              <div className="col-md-4">
                <small className="text-muted">Contacts:</small>
                <div className={`small ${hasValidContacts ? 'text-success' : 'text-warning'}`}>
                  <i className={`bi ${hasValidContacts ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
                  {formData.contacts.filter(c => c.nom.trim() || c.prenom.trim() || c.email.trim()).length} valid contact(s)
                </div>
              </div>
              <div className="col-md-4">
                <small className="text-muted">Activities:</small>
                <div className={`small ${hasValidActivities ? 'text-success' : 'text-warning'}`}>
                  <i className={`bi ${hasValidActivities ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
                  {formData.activites.filter(a => a.trim().length > 0).length} valid activit{formData.activites.filter(a => a.trim().length > 0).length === 1 ? 'y' : 'ies'}
                </div>
              </div>
            </div>
            
            {/* Debug section - remove this after fixing */}
            {process.env.NODE_ENV === 'development' && Object.keys(errors).length > 0 && (
              <div className="mt-3 p-2 bg-light border rounded">
                <small className="text-danger"><strong>Validation Errors:</strong></small>
                <ul className="small mb-0">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key} className="text-danger">{key}: {value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            <i className="bi bi-x-circle"></i> Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!isValid || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i> Create Partner
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePartnerForm;