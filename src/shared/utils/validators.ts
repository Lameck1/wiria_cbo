import { z } from 'zod';

/**
 * Shared Validation Schemas
 * Reusable Zod schemas for consistent validation across the application.
 */

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 characters')
  .max(13, 'Phone number must be at most 13 characters')
  .regex(/^(?:\+254|0)[17]\d{8}$/, 'Invalid Kenyan phone number format');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email is too short')
  .max(100, 'Email is too long');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Legacy Validators (Refactored to use Zod under the hood)
 * Maintained for backward compatibility during transition.
 */

export const validateEmail = (email: string): string | null => {
  const result = emailSchema.safeParse(email);
  return result.success ? null : result.error.errors[0]?.message || 'Invalid email';
};

export const validatePhone = (phone: string): string | null => {
  const result = phoneSchema.safeParse(phone);
  return result.success ? null : result.error.errors[0]?.message || 'Invalid phone';
};

export const validateName = (name: string): string | null => {
  const result = nameSchema.safeParse(name);
  return result.success ? null : result.error.errors[0]?.message || 'Invalid name';
};

export const validateRequired = (value: any, fieldName = 'Field'): string | null => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};
