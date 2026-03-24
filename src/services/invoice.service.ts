// src/services/invoice.service.ts
import { prisma } from '../config/database';
import { CreateInvoiceInput, UpdateInvoiceInput } from '../validators/invoice.validator';

export class InvoiceService {
  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}-${random}`;
  }

  async create(userId: string, data: CreateInvoiceInput) {
    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, userId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    // Verify project if provided
    if (data.projectId) {
      const project = await prisma.project.findFirst({
        where: { id: data.projectId, userId },
      });

      if (!project) {
        throw new Error('Project not found');
      }
    }

    const invoiceNumber = this.generateInvoiceNumber();
    
    // Calculate amount with tax
    const taxAmount = data.amount * (data.taxRate || 0) / 100;
    const totalAmount = data.amount + taxAmount;

    return prisma.invoice.create({
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

  async findAll(userId: string, page: number = 1, pageSize: number = 10, filters?: any) {
    const skip = (page - 1) * pageSize;
    
    const where: any = { userId };
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.clientId) {
      where.clientId = filters.clientId;
    }

    // Check for overdue invoices
    await this.updateOverdueStatuses(userId);

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
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
      prisma.invoice.count({ where }),
    ]);

    return { invoices, total, page, pageSize };
  }

  async findOne(userId: string, id: string) {
    const invoice = await prisma.invoice.findFirst({
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

  async update(userId: string, id: string, data: UpdateInvoiceInput) {
    const invoice = await this.findOne(userId, id);
    
    if (invoice.status === 'paid') {
      throw new Error('Cannot update a paid invoice');
    }

    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        client: true,
        project: true,
      },
    });
  }

  async delete(userId: string, id: string) {
    const invoice = await this.findOne(userId, id);
    
    if (invoice.status === 'paid') {
      throw new Error('Cannot delete a paid invoice');
    }

    return prisma.invoice.delete({
      where: { id },
    });
  }

  async markAsSent(userId: string, id: string) {
    const invoice = await this.findOne(userId, id);
    
    if (invoice.status !== 'draft') {
      throw new Error('Only draft invoices can be sent');
    }

    return prisma.invoice.update({
      where: { id },
      data: { status: 'sent' },
    });
  }

  async markAsPaid(userId: string, id: string) {
    const invoice = await this.findOne(userId, id);
    
    if (invoice.status === 'paid') {
      throw new Error('Invoice is already paid');
    }

    const paidAt = new Date();
    
    // Update client's total billed
    await prisma.client.update({
      where: { id: invoice.clientId },
      data: {
        totalBilled: {
          increment: invoice.amount,
        },
      },
    });

    return prisma.invoice.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt,
      },
    });
  }

  async updateOverdueStatuses(userId: string) {
    const now = new Date();
    
    await prisma.invoice.updateMany({
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

  async generatePaymentLink(userId: string, id: string): Promise<string> {
    const invoice = await this.findOne(userId, id);
    
    // Mock payment link - replace with actual Raenest integration
    const paymentLink = `https://pay.raenest.com/freelanceos/${invoice.id}`;
    
    await prisma.invoice.update({
      where: { id },
      data: { paymentLink },
    });
    
    return paymentLink;
  }
}