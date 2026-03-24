// src/services/project.service.ts
import { prisma } from '../config/database';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';

export class ProjectService {
  async create(userId: string, data: CreateProjectInput) {
    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    return prisma.project.create({
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

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
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
      prisma.project.count({ where }),
    ]);

    return { projects, total, page, pageSize };
  }

  async findOne(userId: string, id: string) {
    const project = await prisma.project.findFirst({
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

  async update(userId: string, id: string, data: UpdateProjectInput) {
    const project = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.project.update({
      where: { id },
      data,
      include: {
        client: true,
      },
    });
  }

  async delete(userId: string, id: string) {
    const project = await prisma.project.findFirst({
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

    return prisma.project.delete({
      where: { id },
    });
  }

  async getMilestones(userId: string, projectId: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.milestone.findMany({
      where: { projectId },
      orderBy: { dueDate: 'asc' },
    });
  }
}