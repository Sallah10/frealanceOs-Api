// src/validators/auth.validator.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50).optional(),
  lastName: z.string().min(1, 'Last name is required').max(50).optional(),
  currency: z.enum(['USD', 'NGN', 'GBP', 'EUR', 'KES', 'GHS']).optional(),
  timezone: z.string().max(64).optional(),
  avatar: z.string().max(500).nullable().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const notificationPrefsSchema = z.object({
  invoicePaid: z.boolean().optional(),
  paymentLinkClicked: z.boolean().optional(),
  deadlineApproaching: z.boolean().optional(),
  proposalResponse: z.boolean().optional(),
});

export const updateNotificationPrefsSchema = notificationPrefsSchema.partial();

export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirm: z.literal('DELETE', {
    errorMap: () => ({ message: 'Type DELETE to confirm account deletion' }),
  }),
});

export const DEFAULT_NOTIFICATION_PREFS = {
  invoicePaid: true,
  paymentLinkClicked: true,
  deadlineApproaching: true,
  proposalResponse: true,
};

export type NotificationPrefs = z.infer<typeof notificationPrefsSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateNotificationPrefsInput = z.infer<typeof updateNotificationPrefsSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;