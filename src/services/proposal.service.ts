// src/services/proposal.service.ts
import { prisma } from '../config/database';
import { CreateProposalInput, UpdateProposalInput } from '../validators/proposal.validator';

export class ProposalService {
  async create(userId: string, data: CreateProposalInput) {
    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return prisma.proposal.create({
      data: {
        ...data,
        userId,
      },
      include: {
        client: true,
      },
    });
  }

  async findAll(userId: string, page: number = 1, pageSize: number = 10, filters?: any) {
    const skip = (page - 1) * pageSize;
    
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    const [proposals, total] = await Promise.all([
      prisma.proposal.findMany({
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
      prisma.proposal.count({ where }),
    ]);

    return { proposals, total, page, pageSize };
  }

  async findOne(userId: string, id: string) {
    const proposal = await prisma.proposal.findFirst({
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

  async update(userId: string, id: string, data: UpdateProposalInput) {
    const proposal = await this.findOne(userId, id);
    
    if (proposal.status !== 'draft') {
      throw new Error('Only draft proposals can be edited');
    }

    return prisma.proposal.update({
      where: { id },
      data,
      include: {
        client: true,
      },
    });
  }

  async delete(userId: string, id: string) {
    const proposal = await this.findOne(userId, id);
    
    if (proposal.status !== 'draft') {
      throw new Error('Only draft proposals can be deleted');
    }

    return prisma.proposal.delete({
      where: { id },
    });
  }

  async send(userId: string, id: string) {
    const proposal = await this.findOne(userId, id);
    
    if (proposal.status !== 'draft') {
      throw new Error('Only draft proposals can be sent');
    }

    return prisma.proposal.update({
      where: { id },
      data: { status: 'sent' },
    });
  }

  async accept(userId: string, id: string) {
    const proposal = await this.findOne(userId, id);
    
    if (proposal.status !== 'sent') {
      throw new Error('Only sent proposals can be accepted');
    }

    return prisma.proposal.update({
      where: { id },
      data: { status: 'accepted' },
    });
  }

  async reject(userId: string, id: string) {
    const proposal = await this.findOne(userId, id);
    
    if (proposal.status !== 'sent') {
      throw new Error('Only sent proposals can be rejected');
    }

    return prisma.proposal.update({
      where: { id },
      data: { status: 'rejected' },
    });
  }
}