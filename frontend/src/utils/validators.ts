// src/utils/validators.ts
export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validatePassword = (password: string) =>
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
// Min 8 chars, at least one uppercase, one number, one special char

export const validateName = (name: string) => {
  const trimmedName = name.trim();
  return trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ ,.'-]+$/.test(trimmedName);
};

export const validatePhone = (phone: string) =>
  /^\+[0-9]{7,15}$/.test(phone.trim()); // +country code optional
