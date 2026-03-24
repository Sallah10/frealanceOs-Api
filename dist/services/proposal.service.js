"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalService = void 0;
const database_1 = require("../config/database");
class ProposalService {
    async create(userId, data) {
        const client = await database_1.prisma.client.findFirst({
            where: { id: data.clientId, userId },
        });
        if (!client) {
            throw new Error('Client not found');
        }
        return database_1.prisma.proposal.create({
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
        const [proposals, total] = await Promise.all([
            database_1.prisma.proposal.findMany({
                where,
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize,
            }),
            database_1.prisma.proposal.count({ where }),
        ]);
        return { proposals, total, page, pageSize };
    }
    async findOne(userId, id) {
        const proposal = await database_1.prisma.proposal.findFirst({
            where: { id, userId },
            include: {
                client: true,
            },
        });
        if (!proposal) {
            throw new Error('Proposal not found');
        }
        return proposal;
    }
    async update(userId, id, data) {
        const proposal = await this.findOne(userId, id);
        if (proposal.status !== 'draft') {
            throw new Error('Only draft proposals can be edited');
        }
        return database_1.prisma.proposal.update({
            where: { id },
            data,
            include: {
                client: true,
            },
        });
    }
    async delete(userId, id) {
        const proposal = await this.findOne(userId, id);
        if (proposal.status !== 'draft') {
            throw new Error('Only draft proposals can be deleted');
        }
        return database_1.prisma.proposal.delete({
            where: { id },
        });
    }
    async send(userId, id) {
        const proposal = await this.findOne(userId, id);
        if (proposal.status !== 'draft') {
            throw new Error('Only draft proposals can be sent');
        }
        return database_1.prisma.proposal.update({
            where: { id },
            data: { status: 'sent' },
        });
    }
    async accept(userId, id) {
        const proposal = await this.findOne(userId, id);
        if (proposal.status !== 'sent') {
            throw new Error('Only sent proposals can be accepted');
        }
        return database_1.prisma.proposal.update({
            where: { id },
            data: { status: 'accepted' },
        });
    }
    async reject(userId, id) {
        const proposal = await this.findOne(userId, id);
        if (proposal.status !== 'sent') {
            throw new Error('Only sent proposals can be rejected');
        }
        return database_1.prisma.proposal.update({
            where: { id },
            data: { status: 'rejected' },
        });
    }
}
exports.ProposalService = ProposalService;
//# sourceMappingURL=proposal.service.js.map