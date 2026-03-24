// src/validators/milestone.validator.ts
import { z } from 'zod';

export const createMilestoneSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(1, 'Milestone name is required').max(200),
  description: z.string().max(500).optional(),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['pending', 'completed', 'paid']).default('pending'),
  dueDate: z.string().datetime(),
});

export const updateMilestoneSchema = createMilestoneSchema.partial();

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;