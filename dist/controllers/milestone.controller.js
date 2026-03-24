"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneController = void 0;
const milestone_service_1 = require("../services/milestone.service");
const request_helpers_1 = require("../utils/request-helpers");
const milestoneService = new milestone_service_1.MilestoneService();
class MilestoneController {
    async create(req, res) {
        try {
            const milestone = await milestoneService.create(req.userId, req.body);
            res.status(201).json({
                success: true,
                data: milestone,
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
    async findAll(req, res) {
        try {
            const page = (0, request_helpers_1.getNumberParam)(req.query.page, 1);
            const pageSize = (0, request_helpers_1.getNumberParam)(req.query.pageSize, 10);
            const projectId = (0, request_helpers_1.getStringParam)(req.query.projectId);
            if (!projectId) {
                res.status(400).json({
                    success: false,
                    error: "Project ID is required",
                });
                return;
            }
            const { milestones, total, page: currentPage, pageSize: currentPageSize, } = await milestoneService.findAll(req.userId, projectId, page, pageSize);
            res.status(200).json({
                success: true,
                data: milestones,
                total,
                page: currentPage,
                pageSize: currentPageSize,
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
    async findOne(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid milestone ID",
                });
                return;
            }
            const milestone = await milestoneService.findOne(req.userId, id);
            res.status(200).json({
                success: true,
                data: milestone,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            else {
                throw error;
            }
        }
    }
    async update(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid milestone ID",
                });
                return;
            }
            const milestone = await milestoneService.update(req.userId, id, req.body);
            res.status(200).json({
                success: true,
                data: milestone,
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
    async delete(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid milestone ID",
                });
                return;
            }
            await milestoneService.delete(req.userId, id);
            res.status(200).json({
                success: true,
                data: { message: "Milestone deleted successfully" },
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
exports.MilestoneController = MilestoneController;
//# sourceMappingURL=milestone.controller.js.map