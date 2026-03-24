// src/validators/project.validator.ts
import { z } from 'zod';

export const createProjectSchema = z.object({
  clientId: z.string().cuid(),
  name: z.string().min(1, 'Project name is required').max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['planning', 'active', 'completed', 'on_hold']).default('planning'),
  budget: z.number().positive('Budget must be positive'),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;