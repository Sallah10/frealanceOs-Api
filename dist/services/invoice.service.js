"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const database_1 = require("../config/database");
class InvoiceService {
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `INV-${year}-${random}`;
    }
    async create(userId, data) {
        const client = await database_1.prisma.client.findFirst({
            where: { id: data.clientId, userId },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        if (data.projectId) {
            const project = await database_1.prisma.project.findFirst({
                where: { id: data.projectId, userId },
            });
            if (!project) {
                throw new Error('Project not found');
            }
        }
        const invoiceNumber = this.generateInvoiceNumber();
        const taxAmount = data.amount * (data.taxRate || 0) / 100;
        const totalAmount = data.amount + taxAmount;
        return database_1.prisma.invoice.create({
            data: {
                ...data,
                userId,
                number: invoiceNumber,
                amount: totalAmount,
                items: JSON.stringify(data.items),
            },
            include: {
                client: true,
                project: true,
            },
        });
    }
    async findAll(userId, page = 1, pageSize = 10, filters) {
        const skip = (page - 1) * pageSize;
        const where = { userId };
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.clientId) {
            where.clientId = filters.clientId;
        }
        await this.updateOverdueStatuses(userId);
        const [invoices, total] = await Promise.all([
            database_1.prisma.invoice.findMany({
                where,
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            database_1.prisma.invoice.count({ where }),
        ]);
        return { invoices, total, page, pageSize };
    }
    async findOne(userId, id) {
        const invoice = await database_1.prisma.invoice.findFirst({
            where: { id, userId },
            include: {
                client: true,
                project: true,
            },
        });
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return invoice;
    }
    async update(userId, id, data) {
        const invoice = await this.findOne(userId, id);
        if (invoice.status === 'paid') {
            throw new Error('Cannot update a paid invoice');
        }
        return database_1.prisma.invoice.update({
            where: { id },
            data,
            include: {
                client: true,
                project: true,
            },
        });
    }
    async delete(userId, id) {
        const invoice = await this.findOne(userId, id);
        if (invoice.status === 'paid') {
            throw new Error('Cannot delete a paid invoice');
        }
        return database_1.prisma.invoice.delete({
            where: { id },
        });
    }
    async markAsSent(userId, id) {
        const invoice = await this.findOne(userId, id);
        if (invoice.status !== 'draft') {
            throw new Error('Only draft invoices can be sent');
        }
        return database_1.prisma.invoice.update({
            where: { id },
            data: { status: 'sent' },
        });
    }
    async markAsPaid(userId, id) {
        const invoice = await this.findOne(userId, id);
        if (invoice.status === 'paid') {
            throw new Error('Invoice is already paid');
        }
        const paidAt = new Date();
        await database_1.prisma.client.update({
            where: { id: invoice.clientId },
            data: {
                totalBilled: {
                    increment: invoice.amount,
                },
            },
        });
        return database_1.prisma.invoice.update({
            where: { id },
            data: {
                status: 'paid',
                paidAt,
            },
        });
    }
    async updateOverdueStatuses(userId) {
        const now = new Date();
        await database_1.prisma.invoice.updateMany({
            where: {
                userId,
                status: 'sent',
                dueDate: { lt: now },
            },
            data: {
                status: 'overdue',
            },
        });
    }
    async generatePaymentLink(userId, id) {
        const invoice = await this.findOne(userId, id);
        const paymentLink = `https://pay.raenest.com/freelanceos/${invoice.id}`;
        await database_1.prisma.invoice.update({
            where: { id },
            data: { paymentLink },
        });
        return paymentLink;
    }
}
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice.service.js.map