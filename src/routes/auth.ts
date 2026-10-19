// src/routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
  updateNotificationPrefsSchema,
  deleteAccountSchema,
} from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put('/password', authenticate, validate(updatePasswordSchema), authController.updatePassword);
router.put(
  '/notifications',
  authenticate,
  validate(updateNotificationPrefsSchema),
  authController.updateNotificationPrefs
);
router.delete(
  '/account',
  authenticate,
  validate(deleteAccountSchema),
  authController.deleteAccount
);

export default router;
