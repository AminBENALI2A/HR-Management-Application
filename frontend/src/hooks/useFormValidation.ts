// src/hooks/useFormValidation.ts
import { useState } from "react";

type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export function useFormValidation<T>(
  initialValues: T,
  validate: (values: T) => ValidationErrors<T>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Validate live as user types
    const newErrors = validate({ ...values, [name]: value });
    setErrors(newErrors);
  };

  const handleSubmit = (onSubmit: () => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit();
    }
  };

  return { values, errors, handleChange, handleSubmit, setValues };
}
