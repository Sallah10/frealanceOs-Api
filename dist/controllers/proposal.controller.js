"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalController = void 0;
const proposal_service_1 = require("../services/proposal.service");
const request_helpers_1 = require("../utils/request-helpers");
const proposalService = new proposal_service_1.ProposalService();
class ProposalController {
    async create(req, res) {
        try {
            const proposal = await proposalService.create(req.userId, req.body);
            res.status(201).json({
                success: true,
                data: proposal,
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
            const { proposals, total, page: currentPage, pageSize: currentPageSize, } = await proposalService.findAll(req.userId, page, pageSize, filters);
            res.status(200).json({
                success: true,
                data: proposals,
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
                    error: "Invalid proposal ID",
                });
                return;
            }
            const proposal = await proposalService.findOne(req.userId, id);
            res.status(200).json({
                success: true,
                data: proposal,
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
                    error: "Invalid proposal ID",
                });
                return;
            }
            const proposal = await proposalService.update(req.userId, id, req.body);
            res.status(200).json({
                success: true,
                data: proposal,
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
                    error: "Invalid proposal ID",
                });
                return;
            }
            await proposalService.delete(req.userId, id);
            res.status(200).json({
                success: true,
                data: { message: "Proposal deleted successfully" },
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
    async send(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid proposal ID",
                });
                return;
            }
            const proposal = await proposalService.send(req.userId, id);
            res.status(200).json({
                success: true,
                data: proposal,
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
    async accept(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid proposal ID",
                });
                return;
            }
            const proposal = await proposalService.accept(req.userId, id);
            res.status(200).json({
                success: true,
                data: proposal,
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
    async reject(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid proposal ID",
                });
                return;
            }
            const proposal = await proposalService.reject(req.userId, id);
            res.status(200).json({
                success: true,
                data: proposal,
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
exports.ProposalController = ProposalController;
//# sourceMappingURL=proposal.controller.js.map