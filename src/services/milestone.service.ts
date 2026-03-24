// src/services/milestone.service.ts
import { prisma } from '../config/database';
import { CreateMilestoneInput, UpdateMilestoneInput } from '../validators/milestone.validator';

export class MilestoneService {
  async create(userId: string, data: CreateMilestoneInput) {
    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, userId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.milestone.create({
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

  async findAll(userId: string, projectId?: string, page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;
    
    const where: any = {};
    
    if (projectId) {
      // Verify project belongs to user
      const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
      });
      
      if (!project) {
        throw new Error('Project not found');
      }
      
      where.projectId = projectId;
    } else {
      // Get all milestones from user's projects
      const userProjects = await prisma.project.findMany({
        where: { userId },
        select: { id: true },
      });
      
      where.projectId = { in: userProjects.map(p => p.id) };
    }

    const [milestones, total] = await Promise.all([
      prisma.milestone.findMany({
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
      prisma.milestone.count({ where }),
    ]);

    return { milestones, total, page, pageSize };
  }

  async findOne(userId: string, id: string) {
    const milestone = await prisma.milestone.findFirst({
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

  async update(userId: string, id: string, data: UpdateMilestoneInput) {
    const milestone = await this.findOne(userId, id);
    
    const updateData: any = { ...data };
    
    // If marking as completed, set completedAt
    if (data.status === 'completed' && milestone.status !== 'completed') {
      updateData.completedAt = new Date();
    }

    return prisma.milestone.update({
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

  async delete(userId: string, id: string) {
    await this.findOne(userId, id);
    
    return prisma.milestone.delete({
      where: { id },
    });
  }
}