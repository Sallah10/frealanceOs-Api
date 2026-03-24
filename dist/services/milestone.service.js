"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneService = void 0;
const database_1 = require("../config/database");
class MilestoneService {
    async create(userId, data) {
        const project = await database_1.prisma.project.findFirst({
            where: { id: data.projectId, userId },
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return database_1.prisma.milestone.create({
            data,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async findAll(userId, projectId, page = 1, pageSize = 10) {
        const skip = (page - 1) * pageSize;
        const where = {};
        if (projectId) {
            const project = await database_1.prisma.project.findFirst({
                where: { id: projectId, userId },
            });
            if (!project) {
                throw new Error('Project not found');
            }
            where.projectId = projectId;
        }
        else {
            const userProjects = await database_1.prisma.project.findMany({
                where: { userId },
                select: { id: true },
            });
            where.projectId = { in: userProjects.map(p => p.id) };
        }
        const [milestones, total] = await Promise.all([
            database_1.prisma.milestone.findMany({
                where,
                include: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
                orderBy: { dueDate: 'asc' },
                skip,
                take: pageSize,
            }),
            database_1.prisma.milestone.count({ where }),
        ]);
        return { milestones, total, page, pageSize };
    }
    async findOne(userId, id) {
        const milestone = await database_1.prisma.milestone.findFirst({
            where: { id },
            include: {
                project: {
                    include: {
                        user: {
                            select: { id: true },
                        },
                    },
                },
            },
        });
        if (!milestone || milestone.project.user.id !== userId) {
            throw new Error('Milestone not found');
        }
        return milestone;
    }
    async update(userId, id, data) {
        const milestone = await this.findOne(userId, id);
        const updateData = { ...data };
        if (data.status === 'completed' && milestone.status !== 'completed') {
            updateData.completedAt = new Date();
        }
        return database_1.prisma.milestone.update({
            where: { id },
            data: updateData,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async delete(userId, id) {
        await this.findOne(userId, id);
        return database_1.prisma.milestone.delete({
            where: { id },
        });
    }
}
exports.MilestoneService = MilestoneService;
//# sourceMappingURL=milestone.service.js.map