"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const client_service_1 = require("../services/client.service");
const request_helpers_1 = require("../utils/request-helpers");
const clientService = new client_service_1.ClientService();
const getString = (value) => {
    if (!value)
        return undefined;
    return Array.isArray(value) ? value[0] : value;
};
class ClientController {
    async create(req, res) {
        try {
            const client = await clientService.create(req.userId, req.body);
            res.status(201).json({
                success: true,
                data: client,
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
            const { clients, total, page: currentPage, pageSize: currentPageSize, } = await clientService.findAll(req.userId, page, pageSize);
            res.status(200).json({
                success: true,
                data: clients,
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
            const id = getString(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid client ID",
                });
                return;
            }
            const client = await clientService.findOne(req.userId, id);
            res.status(200).json({
                success: true,
                data: client,
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
            const id = getString(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid client ID",
                });
                return;
            }
            const client = await clientService.update(req.userId, id, req.body);
            res.status(200).json({
                success: true,
                data: client,
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
            const id = getString(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid client ID",
                });
                return;
            }
            await clientService.delete(req.userId, id);
            res.status(200).json({
                success: true,
                data: { message: "Client deleted successfully" },
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
exports.ClientController = ClientController;
//# sourceMappingURL=client.controller.js.map