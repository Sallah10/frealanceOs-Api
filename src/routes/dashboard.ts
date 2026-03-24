// src/routes/dashboard.ts
import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const dashboardController = new DashboardController();

router.use(authenticate);

router.get('/stats', dashboardController.getStats);
router.get('/earnings', dashboardController.getEarnings);
router.get('/activity', dashboardController.getActivity);

export default router;