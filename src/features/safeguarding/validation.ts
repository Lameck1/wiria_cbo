import { z } from 'zod';

export const safeguardingSchema = z
  .object({
    isAnonymous: z.boolean(),
    reporterName: z.string().optional(),
    reporterEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    reporterPhone: z.string().optional(),
    reporterRelation: z.string().optional(),
    category: z.string().min(1, 'Please select a category'),
    incidentDate: z.string().optional(),
    location: z.string().optional(),
    personsInvolved: z.string().optional(),
    description: z.string().min(20, 'Description must be at least 20 characters'),
  })
  .refine(
    (data) => {
      if (!data.isAnonymous) {
        return !!data.reporterName && !!data.reporterEmail;
      }
      return true;
    },
    {
      message: 'Name and email are required for non-anonymous reports',
      path: ['reporterName'],
    }
  );

export type SafeguardingReportSchema = z.infer<typeof safeguardingSchema>;
