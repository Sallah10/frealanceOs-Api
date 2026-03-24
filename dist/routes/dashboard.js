"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const dashboardController = new dashboard_controller_1.DashboardController();
router.use(auth_1.authenticate);
router.get('/stats', dashboardController.getStats);
router.get('/earnings', dashboardController.getEarnings);
router.get('/activity', dashboardController.getActivity);
exports.default = router;
//# sourceMappingURL=dashboard.js.map