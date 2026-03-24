"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const database_1 = require("../config/database");
class DashboardService {
    async getStats(userId) {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthFirstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        const invoices = await database_1.prisma.invoice.findMany({
            where: { userId },
        });
        const paidInvoices = invoices.filter(i => i.status === 'paid');
        const pendingInvoices = invoices.filter(i => i.status === 'sent');
        const overdueInvoices = invoices.filter(i => i.status === 'overdue');
        const totalEarnings = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
        const monthlyEarnings = paidInvoices
            .filter(i => i.paidAt && i.paidAt >= firstDayOfMonth)
            .reduce((sum, i) => sum + i.amount, 0);
        const lastMonthEarnings = paidInvoices
            .filter(i => i.paidAt && i.paidAt >= lastMonthFirstDay && i.paidAt <= lastMonthLastDay)
            .reduce((sum, i) => sum + i.amount, 0);
        const earningsGrowth = lastMonthEarnings === 0
            ? monthlyEarnings > 0 ? 100 : 0
            : ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
        const activeProjects = await database_1.prisma.project.count({
            where: {
                userId,
                status: 'active',
            },
        });
        const lastMonthActiveProjects = await database_1.prisma.project.count({
            where: {
                userId,
                status: 'active',
                createdAt: {
                    gte: lastMonthFirstDay,
                    lte: lastMonthLastDay,
                },
            },
        });
        const activeProjectsGrowth = lastMonthActiveProjects === 0
            ? activeProjects > 0 ? 100 : 0
            : ((activeProjects - lastMonthActiveProjects) / lastMonthActiveProjects) * 100;
        const pendingInvoicesAmount = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);
        const overdueInvoicesAmount = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);
        const recentClients = await database_1.prisma.client.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                createdAt: true,
            },
        });
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const upcomingDeadlines = await database_1.prisma.milestone.findMany({
            where: {
                project: { userId },
                dueDate: {
                    gte: now,
                    lte: nextWeek,
                },
                status: { not: 'completed' },
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { dueDate: 'asc' },
            take: 10,
        });
        return {
            totalEarnings,
            monthlyEarnings,
            earningsGrowth: Math.round(earningsGrowth * 10) / 10,
            activeProjects,
            activeProjectsGrowth: Math.round(activeProjectsGrowth * 10) / 10,
            pendingInvoices: pendingInvoices.length,
            pendingInvoicesAmount,
            overdueInvoices: overdueInvoices.length,
            overdueInvoicesAmount,
            recentClients,
            upcomingDeadlines: upcomingDeadlines.map(m => ({
                id: m.id,
                name: m.name,
                projectName: m.project.name,
                dueDate: m.dueDate,
                amount: m.amount,
            })),
        };
    }
    async getEarnings(userId, period = 'monthly') {
        const now = new Date();
        const earnings = [];
        if (period === 'monthly') {
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                const paidInvoices = await database_1.prisma.invoice.findMany({
                    where: {
                        userId,
                        status: 'paid',
                        paidAt: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                });
                const amount = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
                earnings.push({
                    period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    amount,
                    date: startOfMonth,
                });
            }
        }
        else {
            for (let i = 11; i >= 0; i--) {
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - (now.getDay() + 7 * i));
                startOfWeek.setHours(0, 0, 0, 0);
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                endOfWeek.setHours(23, 59, 59, 999);
                const paidInvoices = await database_1.prisma.invoice.findMany({
                    where: {
                        userId,
                        status: 'paid',
                        paidAt: {
                            gte: startOfWeek,
                            lte: endOfWeek,
                        },
                    },
                });
                const amount = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
                earnings.push({
                    period: `Week ${i + 1}`,
                    amount,
                    date: startOfWeek,
                });
            }
        }
        return earnings;
    }
    async getActivity(userId, limit = 20) {
        const activities = [];
        const paidInvoices = await database_1.prisma.invoice.findMany({
            where: {
                userId,
                status: 'paid',
                paidAt: { not: null },
            },
            include: {
                client: true,
            },
            orderBy: { paidAt: 'desc' },
            take: limit,
        });
        for (const invoice of paidInvoices) {
            activities.push({
                id: `inv_paid_${invoice.id}`,
                type: 'invoice_paid',
                message: `Invoice ${invoice.number} was paid`,
                timestamp: invoice.paidAt,
                amount: invoice.amount,
                clientName: invoice.client.name,
                entityId: invoice.id,
            });
        }
        const sentInvoices = await database_1.prisma.invoice.findMany({
            where: {
                userId,
                status: 'sent',
            },
            include: {
                client: true,
            },
            orderBy: { updatedAt: 'desc' },
            take: limit,
        });
        for (const invoice of sentInvoices) {
            activities.push({
                id: `inv_sent_${invoice.id}`,
                type: 'invoice_sent',
                message: `Invoice ${invoice.number} was sent to ${invoice.client.name}`,
                timestamp: invoice.updatedAt,
                amount: invoice.amount,
                clientName: invoice.client.name,
                entityId: invoice.id,
            });
        }
        const projects = await database_1.prisma.project.findMany({
            where: { userId },
            include: {
                client: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        for (const project of projects) {
            activities.push({
                id: `project_created_${project.id}`,
                type: 'project_created',
                message: `Project "${project.name}" was created for ${project.client.name}`,
                timestamp: project.createdAt,
                amount: project.budget,
                clientName: project.client.name,
                entityId: project.id,
            });
        }
        const milestones = await database_1.prisma.milestone.findMany({
            where: {
                project: { userId },
                status: 'completed',
                completedAt: { not: null },
            },
            include: {
                project: {
                    include: {
                        client: true,
                    },
                },
            },
            orderBy: { completedAt: 'desc' },
            take: limit,
        });
        for (const milestone of milestones) {
            activities.push({
                id: `milestone_${milestone.id}`,
                type: 'milestone_completed',
                message: `Milestone "${milestone.name}" completed for project ${milestone.project.name}`,
                timestamp: milestone.completedAt,
                amount: milestone.amount,
                clientName: milestone.project.client.name,
                entityId: milestone.id,
            });
        }
        return activities
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, limit);
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map