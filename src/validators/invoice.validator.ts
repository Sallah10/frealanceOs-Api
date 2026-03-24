// src/validators/invoice.validator.ts
import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  rate: z.number().positive(),
});

export const createInvoiceSchema = z.object({
  clientId: z.string().cuid(),
  projectId: z.string().cuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  dueDate: z.string().datetime(),
  items: z.array(invoiceItemSchema),
  notes: z.string().max(500).optional(),
  taxRate: z.number().min(0).max(100).default(0),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;