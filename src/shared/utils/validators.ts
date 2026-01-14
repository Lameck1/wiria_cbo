import { z } from 'zod';

import { LIMITS } from '../constants/config';

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
  .max(LIMITS.MAX_EMAIL_LENGTH, 'Email is too long');

export const nameSchema = z
  .string()
  .min(LIMITS.MIN_NAME_LENGTH, `Name must be at least ${LIMITS.MIN_NAME_LENGTH} characters`)
  .max(LIMITS.MAX_NAME_LENGTH, `Name must be at most ${LIMITS.MAX_NAME_LENGTH} characters`)
  .regex(/^[\s'A-Za-z-]+$/, 'Name contains invalid characters');

export const passwordSchema = z
  .string()
  .min(LIMITS.MIN_PASSWORD_LENGTH, `Password must be at least ${LIMITS.MIN_PASSWORD_LENGTH} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^\dA-Za-z]/, 'Password must contain at least one special character');

/**
 * Validation Result Type
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Sanitizes input by removing HTML tags and trimming whitespace.
 * Preserves text content inside tags.
 */
export const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') return '';
  // Remove HTML tags but keep their content, remove stray angle brackets, then trim
  return input
    .replaceAll(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags and content
    .replaceAll(/<[^>]*>/g, '') // Remove remaining HTML tags but keep content
    .replaceAll(/[<>]/g, '') // Remove stray angle brackets
    .trim();
};

/**
 * Validates Kenyan phone numbers (format: 254XXXXXXXXX)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove spaces for validation
  const cleaned = phone.replaceAll(/\s/g, '');

  // Must be 12 digits starting with 254
  const phoneRegex = /^254[17]\d{8}$/;
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, error: 'Invalid phone number format. Use 254XXXXXXXXX' };
  }

  return { valid: true };
};

/**
 * Validates M-Pesa phone numbers (Safaricom only)
 * Safaricom prefixes: 0700-0719, 0720-0721 (0722+ is Airtel), 0740-0759, 0790-0799, 0110-0119
 * In 254 format: 254XXXXXXXXX
 */
export const validateMpesaPhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Phone number is required' };
  }

  const cleaned = phone.replaceAll(/\s/g, '');

  // Safaricom prefixes in 254 format:
  // 25470[0-9] = 0700-0709, 25471[0-9] = 0710-0719 (Safaricom)
  // 0722, 0723, 0733 etc are Airtel, not Safaricom
  // 2547[4-5]X = 074X-075X (Safaricom)
  // 25479X = 079X (Safaricom)
  // 2541[0-1]X = 010X-011X (Safaricom)
  const safaricomRegex = /^254(70|71|7[45]|79|1[01])\d{7}$/;
  if (!safaricomRegex.test(cleaned)) {
    return { valid: false, error: 'Please use a valid Safaricom number for M-Pesa' };
  }

  return { valid: true };
};

/**
 * Validates email addresses
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message || 'Invalid email' };
  }

  return { valid: true };
};

/**
 * Validates donation amounts
 */
export const validateAmount = (amount: number | string): ValidationResult => {
  const numberAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;

  if (isNaN(numberAmount)) {
    return { valid: false, error: 'Please enter a valid amount' };
  }

  if (numberAmount < LIMITS.MIN_DONATION) {
    return { valid: false, error: `Minimum donation amount is KES ${LIMITS.MIN_DONATION}` };
  }

  if (numberAmount > LIMITS.MAX_DONATION) {
    return { valid: false, error: `Maximum donation amount is KES ${LIMITS.MAX_DONATION.toLocaleString()}` };
  }

  return { valid: true };
};

/**
 * Validates that a field is not empty
 */
export const validateRequired = (value: unknown, fieldName = 'Field'): ValidationResult => {
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

/**
 * Validates names
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }

  const result = nameSchema.safeParse(name);
  if (!result.success) {
    return { valid: false, error: result.error.errors[0]?.message || 'Invalid name' };
  }

  return { valid: true };
};

