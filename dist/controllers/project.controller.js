"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const project_service_1 = require("../services/project.service");
const request_helpers_1 = require("../utils/request-helpers");
const projectService = new project_service_1.ProjectService();
class ProjectController {
    async create(req, res) {
        try {
            const project = await projectService.create(req.userId, req.body);
            res.status(201).json({
                success: true,
                data: project,
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
            const filters = {
                status: (0, request_helpers_1.getStringParam)(req.query.status),
                clientId: (0, request_helpers_1.getStringParam)(req.query.clientId),
            };
            const { projects, total, page: currentPage, pageSize: currentPageSize, } = await projectService.findAll(req.userId, page, pageSize, filters);
            res.status(200).json({
                success: true,
                data: projects,
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
                    error: "Invalid project ID",
                });
                return;
            }
            const project = await projectService.findOne(req.userId, id);
            res.status(200).json({
                success: true,
                data: project,
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
                    error: "Invalid project ID",
                });
                return;
            }
            const project = await projectService.update(req.userId, id, req.body);
            res.status(200).json({
                success: true,
                data: project,
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
                    error: "Invalid project ID",
                });
                return;
            }
            await projectService.delete(req.userId, id);
            res.status(200).json({
                success: true,
                data: { message: "Project deleted successfully" },
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
    async getMilestones(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid project ID",
                });
                return;
            }
            const milestones = await projectService.getMilestones(req.userId, id);
            res.status(200).json({
                success: true,
                data: milestones,
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
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map