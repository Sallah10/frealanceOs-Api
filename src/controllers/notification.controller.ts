// src/controllers/notification.controller.ts
import { Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../middleware/auth';

const notificationService = new NotificationService();

export class NotificationController {
  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = await notificationService.list(req.userId!);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }
}
