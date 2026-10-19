// src/services/notification.service.ts
import { prisma } from '../config/database';

export interface NotificationItem {
  id: string;
  type:
    | 'invoice_paid'
    | 'invoice_overdue'
    | 'deadline_approaching'
    | 'proposal_response';
  title: string;
  description: string;
  href: string;
  createdAt: string;
  read: boolean;
}

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

export class NotificationService {
  async list(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { notificationPrefs: true },
    });

    const prefs = {
      invoicePaid: true,
      paymentLinkClicked: true,
      deadlineApproaching: true,
      proposalResponse: true,
      ...((user?.notificationPrefs as Record<string, boolean> | null) ?? {}),
    };

    const now = new Date();
    const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const [paidInvoices, overdueInvoices, projects, proposals] = await Promise.all([
      prefs.invoicePaid
        ? prisma.invoice.findMany({
            where: { userId, status: 'paid', paidAt: { not: null } },
            orderBy: { paidAt: 'desc' },
            take: 5,
            include: { client: { select: { name: true } } },
          })
        : Promise.resolve([]),
      prisma.invoice.findMany({
        where: { userId, status: { in: ['sent', 'overdue'] }, dueDate: { lt: now } },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: { client: { select: { name: true } } },
      }),
      prefs.deadlineApproaching
        ? prisma.project.findMany({
            where: {
              userId,
              status: { in: ['planning', 'active'] },
              deadline: { not: null, gte: now, lte: soon },
            },
            orderBy: { deadline: 'asc' },
            take: 5,
          })
        : Promise.resolve([]),
      prefs.proposalResponse
        ? prisma.proposal.findMany({
            where: { userId, status: { in: ['accepted', 'rejected'] } },
            orderBy: { updatedAt: 'desc' },
            take: 5,
            include: { client: { select: { name: true } } },
          })
        : Promise.resolve([]),
    ]);

    const items: NotificationItem[] = [];

    for (const invoice of paidInvoices) {
      items.push({
        id: `paid_${invoice.id}`,
        type: 'invoice_paid',
        title: `Invoice ${invoice.number} paid`,
        description: `${invoice.client.name} paid ${invoice.currency} ${invoice.amount.toLocaleString()}.`,
        href: `/invoices/${invoice.id}`,
        createdAt: (invoice.paidAt ?? invoice.updatedAt).toISOString(),
        read: false,
      });
    }

    for (const invoice of overdueInvoices) {
      const days = Math.abs(daysBetween(invoice.dueDate, now));
      items.push({
        id: `overdue_${invoice.id}`,
        type: 'invoice_overdue',
        title: `Invoice ${invoice.number} is overdue`,
        description: `${invoice.client.name} - ${days} day${days === 1 ? '' : 's'} past due (${invoice.currency} ${invoice.amount.toLocaleString()}).`,
        href: `/invoices/${invoice.id}`,
        createdAt: invoice.dueDate.toISOString(),
        read: false,
      });
    }

    for (const project of projects) {
      if (!project.deadline) continue;
      const days = Math.max(daysBetween(now, project.deadline), 0);
      items.push({
        id: `deadline_${project.id}`,
        type: 'deadline_approaching',
        title: `"${project.name}" deadline approaching`,
        description:
          days === 0
            ? 'Due today.'
            : `Due in ${days} day${days === 1 ? '' : 's'}.`,
        href: `/projects`,
        createdAt: project.deadline.toISOString(),
        read: false,
      });
    }

    for (const proposal of proposals) {
      items.push({
        id: `proposal_${proposal.id}`,
        type: 'proposal_response',
        title: `Proposal "${proposal.title}" ${proposal.status}`,
        description: `${proposal.client.name} ${proposal.status === 'accepted' ? 'accepted' : 'declined'} your proposal.`,
        href: `/proposals`,
        createdAt: proposal.updatedAt.toISOString(),
        read: proposal.status === 'accepted',
      });
    }

    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return {
      notifications: items.slice(0, 12),
      unreadCount: items.filter((item) => !item.read).length,
      prefs,
    };
  }
}
