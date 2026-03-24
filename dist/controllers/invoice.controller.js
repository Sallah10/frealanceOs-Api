"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const invoice_service_1 = require("../services/invoice.service");
const raenest_service_1 = require("../services/raenest.service");
const request_helpers_1 = require("../utils/request-helpers");
const invoiceService = new invoice_service_1.InvoiceService();
const raenestService = new raenest_service_1.RaenestService();
class InvoiceController {
    async create(req, res) {
        try {
            const invoice = await invoiceService.create(req.userId, req.body);
            res.status(201).json({
                success: true,
                data: invoice,
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
            const { invoices, total, page: currentPage, pageSize: currentPageSize, } = await invoiceService.findAll(req.userId, page, pageSize, filters);
            res.status(200).json({
                success: true,
                data: invoices,
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
                    error: "Invalid invoice ID",
                });
                return;
            }
            const invoice = await invoiceService.findOne(req.userId, id);
            res.status(200).json({
                success: true,
                data: invoice,
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
                    error: "Invalid invoice ID",
                });
                return;
            }
            const invoice = await invoiceService.update(req.userId, id, req.body);
            res.status(200).json({
                success: true,
                data: invoice,
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
                    error: "Invalid invoice ID",
                });
                return;
            }
            await invoiceService.delete(req.userId, id);
            res.status(200).json({
                success: true,
                data: { message: "Invoice deleted successfully" },
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
                    error: "Invalid invoice ID",
                });
                return;
            }
            const invoice = await invoiceService.markAsSent(req.userId, id);
            res.status(200).json({
                success: true,
                data: invoice,
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
    async markAsPaid(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid invoice ID",
                });
                return;
            }
            const invoice = await invoiceService.markAsPaid(req.userId, id);
            res.status(200).json({
                success: true,
                data: invoice,
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
    async generatePaymentLink(req, res) {
        try {
            const id = (0, request_helpers_1.getStringParam)(req.params.id);
            if (!id) {
                res.status(400).json({
                    success: false,
                    error: "Invalid invoice ID",
                });
                return;
            }
            const invoice = await invoiceService.findOne(req.userId, id);
            const paymentLink = await raenestService.generatePaymentLink(invoice.id, invoice.amount, invoice.currency);
            res.status(200).json({
                success: true,
                data: { paymentLink },
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
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map