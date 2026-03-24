"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const database_1 = require("../config/database");
class ProjectService {
    async create(userId, data) {
        const client = await database_1.prisma.client.findFirst({
            where: { id: data.clientId, userId },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        return database_1.prisma.project.create({
            data: {
                ...data,
                userId,
            },
            include: {
                client: true,
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
        const [projects, total] = await Promise.all([
            database_1.prisma.project.findMany({
                where,
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    _count: {
                        select: { milestones: true, invoices: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            database_1.prisma.project.count({ where }),
        ]);
        return { projects, total, page, pageSize };
    }
    async findOne(userId, id) {
        const project = await database_1.prisma.project.findFirst({
            where: { id, userId },
            include: {
                client: true,
                milestones: {
                    orderBy: { dueDate: 'asc' },
                },
                invoices: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return project;
    }
    async update(userId, id, data) {
        const project = await database_1.prisma.project.findFirst({
            where: { id, userId },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return database_1.prisma.project.update({
            where: { id },
            data,
            include: {
                client: true,
            },
        });
    }
    async delete(userId, id) {
        const project = await database_1.prisma.project.findFirst({
            where: { id, userId },
            include: {
                invoices: {
                    where: { status: { not: 'paid' } },
                },
                milestones: {
                    where: { status: { not: 'completed' } },
                },
            },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        if (project.invoices.length > 0) {
            throw new Error('Cannot delete project with unpaid invoices');
        }
        if (project.milestones.length > 0) {
            throw new Error('Cannot delete project with pending milestones');
        }
        return database_1.prisma.project.delete({
            where: { id },
        });
    }
    async getMilestones(userId, projectId) {
        const project = await database_1.prisma.project.findFirst({
            where: { id: projectId, userId },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return database_1.prisma.milestone.findMany({
            where: { projectId },
            orderBy: { dueDate: 'asc' },
        });
    }
}
exports.ProjectService = ProjectService;
//# sourceMappingURL=project.service.js.map