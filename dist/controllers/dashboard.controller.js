"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../services/dashboard.service");
const dashboardService = new dashboard_service_1.DashboardService();
class DashboardController {
    async getStats(req, res) {
        try {
            const stats = await dashboardService.getStats(req.userId);
            res.status(200).json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
    async getEarnings(req, res) {
        try {
            const period = req.query.period || 'monthly';
            const earnings = await dashboardService.getEarnings(req.userId, period);
            res.status(200).json({
                success: true,
                data: earnings,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
    async getActivity(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 20;
            const activity = await dashboardService.getActivity(req.userId, limit);
            res.status(200).json({
                success: true,
                data: activity,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map