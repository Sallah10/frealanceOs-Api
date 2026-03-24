// src/validators/proposal.validator.ts
import { z } from 'zod';

export const createProposalSchema = z.object({
  clientId: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  validUntil: z.string().datetime().optional(),
});

export const updateProposalSchema = createProposalSchema.partial();

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;