import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^[\d\s()+-]{7,20}$/.test(value), {
      message: 'Please enter a valid phone number',
    }),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message reached maximum limit'),
});

export type ContactFormSchema = z.infer<typeof contactSchema>;
