// src/services/client.service.ts
import { prisma } from '../config/database';
import { CreateClientInput, UpdateClientInput } from '../validators/client.validator';

export class ClientService {
  async create(userId: string, data: CreateClientInput) {
    return prisma.client.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
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
      prisma.client.count({ where: { userId } }),
    ]);

    return { clients, total, page, pageSize };
  }

  async findOne(userId: string, id: string) {
    const client = await prisma.client.findFirst({
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

  async update(userId: string, id: string, data: UpdateClientInput) {
    const client = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const client = await prisma.client.findFirst({
      where: { id, userId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    // Check if client has active projects or invoices
    const hasActiveProjects = await prisma.project.count({
      where: { clientId: id, status: { not: 'completed' } },
    });

    const hasUnpaidInvoices = await prisma.invoice.count({
      where: { clientId: id, status: { not: 'paid' } },
    });

    if (hasActiveProjects > 0 || hasUnpaidInvoices > 0) {
      throw new Error('Cannot delete client with active projects or unpaid invoices');
    }

    return prisma.client.delete({
      where: { id },
    });
  }
}