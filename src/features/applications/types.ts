import { z } from 'zod';

export const EDUCATION_OPTIONS = [
    { value: 'certificate', label: 'Certificate' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD/Doctorate' },
    { value: 'other', label: 'Other' },
] as const;

export const EXPERIENCE_OPTIONS = [
    { value: '0-1', label: 'Less than 1 year' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
] as const;

export const applicationSchema = z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    location: z.string().min(2, 'Location is required'),
    education: z.string().min(1, 'Please select your education level'),
    fieldOfStudy: z.string().min(2, 'Field of study is required'),
    experience: z.string().min(1, 'Please select your years of experience'),
    motivation: z.string().min(100, 'Motivation must be at least 100 characters'),
    skills: z.string().optional(),
    cvLink: z.string().url('Invalid CV link URL'),
    coverLetterLink: z.string().url('Invalid cover letter link URL').optional().or(z.literal('')),
    consent: z.literal(true, {
        errorMap: () => ({ message: 'You must consent to proceed' }),
    }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export interface ApplicationPayload {
    type: 'CAREER' | 'OPPORTUNITY';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    coverLetter: string;
    careerId?: string;
    opportunityId?: string;
    resumeUrl: string | null;
    additionalDocs: string[];
}
