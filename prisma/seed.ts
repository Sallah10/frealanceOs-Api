// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await hashPassword('Demo@12345');

  const user = await prisma.user.upsert({
    where: { email: 'demo@freelanceos.dev' },
    update: {
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      currency: 'USD',
      timezone: 'UTC',
    },
    create: {
      email: 'demo@freelanceos.dev',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      currency: 'USD',
      timezone: 'UTC',
      avatar: 'https://ui-avatars.com/api/?background=0D9488&color=fff&name=Demo+User',
    },
  });

  console.log(`User: ${user.email}`);

  // Clients
  const techstack = await prisma.client.upsert({
    where: { id: 'demo-client-techstack' },
    update: {},
    create: {
      id: 'demo-client-techstack',
      userId: user.id,
      name: 'TechStack Inc',
      email: 'billing@techstack.dev',
      company: 'TechStack Inc',
      phone: '+1 555 0100',
      country: 'US',
      avatar: 'https://ui-avatars.com/api/?background=3B82F6&color=fff&name=TS',
    },
  });

  const creative = await prisma.client.upsert({
    where: { id: 'demo-client-creative' },
    update: {},
    create: {
      id: 'demo-client-creative',
      userId: user.id,
      name: 'Creative Mind Agency',
      email: 'finance@creativemind.com',
      company: 'Creative Mind Agency',
      phone: '+1 415 555 0123',
      country: 'US',
      avatar: 'https://ui-avatars.com/api/?background=EF4444&color=fff&name=CM',
    },
  });

  const afrika = await prisma.client.upsert({
    where: { id: 'demo-client-afrika' },
    update: {},
    create: {
      id: 'demo-client-afrika',
      userId: user.id,
      name: 'Africa Startups',
      email: 'ops@africastartups.co',
      company: 'Africa Startups',
      phone: '+254 700 000 000',
      country: 'KE',
      avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=AS',
    },
  });

  // Projects
  const ecommerce = await prisma.project.upsert({
    where: { id: 'demo-project-ecom' },
    update: {},
    create: {
      id: 'demo-project-ecom',
      userId: user.id,
      clientId: techstack.id,
      name: 'E-commerce Platform Redesign',
      description: 'UI/UX refresh and performance improvements',
      status: 'active',
      budget: 4500,
      currency: 'USD',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    },
  });

  const branding = await prisma.project.upsert({
    where: { id: 'demo-project-brand' },
    update: {},
    create: {
      id: 'demo-project-brand',
      userId: user.id,
      clientId: creative.id,
      name: 'Brand Identity Package',
      description: 'Logo, guidelines and assets',
      status: 'active',
      budget: 1200,
      currency: 'USD',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  // Milestones
  await prisma.milestone.upsert({
    where: { id: 'demo-ms-1' },
    update: {},
    create: {
      id: 'demo-ms-1',
      projectId: ecommerce.id,
      name: 'Wireframes & Prototypes',
      description: 'Low-fi and hi-fi prototypes',
      amount: 1500,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: 'pending',
    },
  });

  await prisma.milestone.upsert({
    where: { id: 'demo-ms-2' },
    update: {},
    create: {
      id: 'demo-ms-2',
      projectId: branding.id,
      name: 'Concepts Delivery',
      description: 'Initial design concepts',
      amount: 600,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      status: 'pending',
    },
  });

  // Invoices (store items as array in Json)
  await prisma.invoice.upsert({
    where: { number: 'INV-2026-001' },
    update: {},
    create: {
      userId: user.id,
      clientId: techstack.id,
      projectId: ecommerce.id,
      number: 'INV-2026-001',
      amount: 1500,
      currency: 'USD',
      status: 'sent',
      issueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      items: [
        { description: 'Wireframe delivery', quantity: 1, rate: 1500, amount: 1500 },
      ],
      notes: 'Thank you for your business.',
    },
  });

  await prisma.invoice.upsert({
    where: { number: 'INV-2026-002' },
    update: {},
    create: {
      userId: user.id,
      clientId: creative.id,
      projectId: branding.id,
      number: 'INV-2026-002',
      amount: 600,
      currency: 'USD',
      status: 'draft',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      items: [
        { description: 'Concept phase', quantity: 1, rate: 600, amount: 600 },
      ],
      notes: 'Draft invoice.',
    },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
