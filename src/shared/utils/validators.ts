export type ValidationResult = { valid: true; error?: never } | { valid: false; error: string };

export function sanitizeInput(input: unknown): string {
    if (typeof input !== 'string') return '';

    // Remove script/style blocks entirely (including their contents),
    // then remove remaining HTML tags and stray angle brackets.
    return input
        .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/[<>]/g, '')
        .trim();
}

export function validateRequired(value: unknown, fieldName = 'This field'): ValidationResult {
    const str = typeof value === 'string' ? value.trim() : '';
    if (!str) {
        return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
}

export function validateEmail(email: unknown): ValidationResult {
    const required = validateRequired(email, 'Email');
    if (!required.valid) return required;

    const normalized = String(email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
        return { valid: false, error: 'Invalid email address' };
    }

    return { valid: true };
}

export function validatePhone(phone: unknown): ValidationResult {
    const required = validateRequired(phone, 'Phone number');
    if (!required.valid) return required;

    const normalized = String(phone).replace(/\s+/g, '');

    // Accept Kenyan numbers in international format.
    // Examples: 254712345678, 254722345678
    const kenyaRegex = /^254\d{9}$/;
    if (!kenyaRegex.test(normalized)) {
        return { valid: false, error: 'Invalid phone number' };
    }

    return { valid: true };
}

export function validateMpesaPhone(phone: unknown): ValidationResult {
    const base = validatePhone(phone);
    if (!base.valid) return base;

    const normalized = String(phone).replace(/\s+/g, '');

    // M-Pesa is Safaricom-only. For now we keep the accepted prefixes narrow
    // to match current product/test expectations.
    const safaricomRegex = /^(25471\d{7}|25411\d{7})$/;

    if (!safaricomRegex.test(normalized)) {
        return { valid: false, error: 'Only Safaricom numbers are supported for M-Pesa payments' };
    }

    return { valid: true };
}

export function validateAmount(amount: unknown, min = 10, max = 1_000_000): ValidationResult {
    const n = typeof amount === 'number' ? amount : Number(String(amount).trim());

    if (!Number.isFinite(n)) {
        return { valid: false, error: 'Please enter a valid amount' };
    }

    if (n < min) {
        return { valid: false, error: `Minimum donation amount is ${min}` };
    }

    if (n > max) {
        return { valid: false, error: `Maximum donation amount is ${max}` };
    }

    return { valid: true };
}
