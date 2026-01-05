import { describe, it, expect } from 'vitest';
import {
  validatePhone,
  validateMpesaPhone,
  validateEmail,
  validateAmount,
  validateRequired,
  sanitizeInput,
} from '@/shared/utils/validators';

describe('Validators', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should remove angle brackets', () => {
      expect(sanitizeInput('Test < > symbols')).toBe('Test  symbols');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  spaced  ')).toBe('spaced');
    });

    it('should handle non-string input', () => {
      expect(sanitizeInput(123)).toBe('');
      expect(sanitizeInput(null)).toBe('');
    });
  });

  describe('validatePhone', () => {
    it('should accept valid Kenyan phone numbers', () => {
      expect(validatePhone('254712345678').valid).toBe(true);
      expect(validatePhone('254722345678').valid).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('0712345678').valid).toBe(false);
      expect(validatePhone('254712').valid).toBe(false);
      expect(validatePhone('123456789012').valid).toBe(false);
    });

    it('should reject empty phone numbers', () => {
      const result = validatePhone('');
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: 'Phone number is required' }));
    });

    it('should handle whitespace', () => {
      expect(validatePhone('254 712 345 678').valid).toBe(true);
    });
  });

  describe('validateMpesaPhone', () => {
    it('should accept valid M-Pesa numbers', () => {
      expect(validateMpesaPhone('254712345678').valid).toBe(true);
      expect(validateMpesaPhone('254112345678').valid).toBe(true);
    });

    it('should reject non-Safaricom numbers', () => {
      expect(validateMpesaPhone('254722345678').valid).toBe(false); // Airtel
      expect(validateMpesaPhone('254733345678').valid).toBe(false); // Airtel
    });
  });

  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('test@example.com').valid).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.ke').valid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid').valid).toBe(false);
      expect(validateEmail('@example.com').valid).toBe(false);
      expect(validateEmail('test@').valid).toBe(false);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: 'Email is required' }));
    });
  });

  describe('validateAmount', () => {
    it('should accept valid amounts', () => {
      expect(validateAmount(100).valid).toBe(true);
      expect(validateAmount('500').valid).toBe(true);
      expect(validateAmount(10).valid).toBe(true); // Minimum
    });

    it('should reject amounts below minimum', () => {
      const result = validateAmount(5);
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: expect.stringContaining('Minimum donation amount') }));
    });

    it('should reject amounts above maximum', () => {
      const result = validateAmount(2000000);
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: expect.stringContaining('Maximum donation amount') }));
    });

    it('should reject non-numeric amounts', () => {
      const result = validateAmount('abc');
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: 'Please enter a valid amount' }));
    });
  });

  describe('validateRequired', () => {
    it('should accept non-empty values', () => {
      expect(validateRequired('test').valid).toBe(true);
      expect(validateRequired('  value  ').valid).toBe(true);
    });

    it('should reject empty values', () => {
      const result = validateRequired('');
      expect(result.valid).toBe(false);
      expect(result).toEqual(expect.objectContaining({ error: expect.stringContaining('required') }));
    });

    it('should use custom field name in error', () => {
      const result = validateRequired('', 'Username');
      expect(result).toEqual(expect.objectContaining({ error: 'Username is required' }));
    });
  });
});
