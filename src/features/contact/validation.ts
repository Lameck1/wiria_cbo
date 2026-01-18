import { z } from 'zod';

import { phoneSchema } from '@/shared/utils/validators';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: phoneSchema.optional(), // Use shared phone schema for consistency
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message reached maximum limit'),
});

export type ContactFormSchema = z.infer<typeof contactSchema>;
