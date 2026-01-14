/**
 * Registration Form Validation Schema
 */

import { z } from 'zod';

export const registrationSchema = z
  .object({
    membershipType: z.enum(['INDIVIDUAL', 'GROUP']),
    groupName: z.string().optional(),
    memberCount: z.number().min(1).optional(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    dateOfBirth: z.string().optional(),
    gender: z
      .enum(['MALE', 'FEMALE', 'OTHER'], {
        required_error: 'Please select your gender',
      })
      .optional(),
    nationalId: z.string().max(20, 'National ID must be at most 20 characters').optional(),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z
      .string()
      .regex(/^(\+?254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number'),
    county: z.string().min(1, 'County is required'),
    subCounty: z.string().min(1, 'Sub-county is required'),
    ward: z.string().min(1, 'Ward is required'),
    village: z.string().min(1, 'Village is required'),
    membershipFee: z.number().min(100, 'Minimum membership fee is KES 100'),
    paymentMethod: z.enum(['STK_PUSH', 'MANUAL']),
    agreedToTerms: z.boolean().refine((value) => value === true, {
      message: 'You must agree to the terms and conditions',
    }),
    consentToDataProcessing: z.boolean().refine((value) => value === true, {
      message: 'You must consent to data processing',
    }),
  })
  .superRefine((data, context) => {
    if (data.membershipType === 'GROUP') {
      if (!data.groupName) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Group name is required for group membership',
          path: ['groupName'],
        });
      }
      if (!data.memberCount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Member count is required for group membership',
          path: ['memberCount'],
        });
      }
    } else {
      // Individual specific requirements
      if (!data.dateOfBirth || data.dateOfBirth.length === 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Date of birth is required',
          path: ['dateOfBirth'],
        });
      }
      if (!data.gender) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your gender',
          path: ['gender'],
        });
      }
      if (!data.nationalId || data.nationalId.length < 6) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'National ID must be at least 6 characters',
          path: ['nationalId'],
        });
      }
    }
  });

export const renewalSchema = z.object({
  paymentMethod: z.enum(['STK_PUSH', 'MANUAL']),
  phoneNumber: z
    .string()
    .regex(/^(\+?254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number')
    .optional(),
  transactionCode: z.string().optional(),
  memberCount: z.number().min(1).optional(),
  agreedToDataProtection: z.boolean().refine((value) => value === true, {
    message: 'You must consent to data protection',
  }),
  agreedToCodeOfEthics: z.boolean().refine((value) => value === true, {
    message: 'You must agree to the code of ethics',
  }),
});

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^(\+?254|0)[17]\d{8}$/, 'Please enter a valid Kenyan phone number'),
  occupation: z.string().optional(),
  address: z.string().optional(),
  county: z.string().optional(),
  subcounty: z.string().optional(),
  ward: z.string().optional(),
  interests: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
});

export type ProfileFormSchema = z.infer<typeof profileSchema>;
export type RenewalFormSchema = z.infer<typeof renewalSchema>;
export type RegistrationFormSchema = z.infer<typeof registrationSchema>;
