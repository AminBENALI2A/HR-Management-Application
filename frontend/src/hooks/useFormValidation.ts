import { useState, useCallback } from "react";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useFormValidation<T>(
  initialValues: T,
  validate: (values: T) => ValidationErrors<T>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  // Helper to deeply update nested fields (e.g., 'contacts[0].nom')
  const updateNestedField = <T>(obj: T, path: string, value: any): T => {
    const keys = path.split(/[.[\]]/).filter(Boolean);
    const newObj = { ...obj };

    let current: any = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValues = name.includes('[') || name.includes('.')
      ? updateNestedField(values, name, value)
      : { ...values, [name]: value };

    setValues(newValues as T);
    setErrors(validate(newValues)); // Single source of validation
  }, [values, validate]);

  const handleSubmit = useCallback(
    (onSubmit: () => void) => (e: React.FormEvent) => {
      e.preventDefault();
      const validationErrors = validate(values);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        onSubmit();
      }
    },
    [values, validate]
  );

  return { values, errors, handleChange, handleSubmit, setValues };
}