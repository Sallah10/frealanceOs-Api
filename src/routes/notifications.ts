// src/routes/notifications.ts
import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticate, notificationController.list);

export default router;
