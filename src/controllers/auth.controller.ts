// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        data: { token, user },
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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await authService.login(req.body);
      res.status(200).json({
        success: true,
        data: { token, user },
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getMe(req.userId!);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
      } else {
        throw error;
      }
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.updateProfile(req.userId!, req.body);
      res.status(200).json({
        success: true,
        data: user,
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

  async updatePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.updatePassword(req.userId!, req.body);
      res.status(200).json({
        success: true,
        data: { message: 'Password updated' },
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

  async updateNotificationPrefs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.updateNotificationPrefs(
        req.userId!,
        req.body,
      );
      res.status(200).json({
        success: true,
        data: result,
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

  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.softDelete(req.userId!, req.body);
      res.status(200).json({
        success: true,
        data: { message: 'Account deleted' },
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