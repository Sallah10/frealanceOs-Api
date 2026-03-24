// src/controllers/dashboard.controller.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export class DashboardController {
  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getStats(req.userId!);
      res.status(200).json({
        success: true,
        data: stats,
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

  async getEarnings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const period = (req.query.period as 'monthly' | 'weekly') || 'monthly';
      const earnings = await dashboardService.getEarnings(req.userId!, period);
      res.status(200).json({
        success: true,
        data: earnings,
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

  async getActivity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activity = await dashboardService.getActivity(req.userId!, limit);
      res.status(200).json({
        success: true,
        data: activity,
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