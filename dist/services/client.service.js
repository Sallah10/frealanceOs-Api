"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const database_1 = require("../config/database");
class ClientService {
    async create(userId, data) {
        return database_1.prisma.client.create({
            data: {
                ...data,
                userId,
            },
        });
    }
    async findAll(userId, page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const [clients, total] = await Promise.all([
            database_1.prisma.client.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    _count: {
                        select: { projects: true, invoices: true },
                    },
                },
            }),
            database_1.prisma.client.count({ where: { userId } }),
        ]);
        return { clients, total, page, pageSize };
    }
    async findOne(userId, id) {
        const client = await database_1.prisma.client.findFirst({
            where: { id, userId },
            include: {
                projects: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
                invoices: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        return client;
    }
    async update(userId, id, data) {
        const client = await database_1.prisma.client.findFirst({
            where: { id, userId },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        return database_1.prisma.client.update({
            where: { id },
            data,
        });
    }
    async delete(userId, id) {
        const client = await database_1.prisma.client.findFirst({
            where: { id, userId },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        const hasActiveProjects = await database_1.prisma.project.count({
            where: { clientId: id, status: { not: 'completed' } },
        });
        const hasUnpaidInvoices = await database_1.prisma.invoice.count({
            where: { clientId: id, status: { not: 'paid' } },
        });
        if (hasActiveProjects > 0 || hasUnpaidInvoices > 0) {
            throw new Error('Cannot delete client with active projects or unpaid invoices');
        }
        return database_1.prisma.client.delete({
            where: { id },
        });
    }
}
exports.ClientService = ClientService;
//# sourceMappingURL=client.service.js.map