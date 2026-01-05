/**
 * Application Form Constants
 * Single responsibility: Store form options and static data
 */

export const EDUCATION_OPTIONS = [
    { value: '', label: 'Select education level' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD/Doctorate' },
] as const;

export const EXPERIENCE_OPTIONS = [
    { value: '', label: 'Select experience' },
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
] as const;

export const MINIMUM_MOTIVATION_LENGTH = 100;
