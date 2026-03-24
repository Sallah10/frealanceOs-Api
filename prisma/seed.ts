// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await hashPassword('Demo@123456');
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@freelanceos.com' },
    update: {},
    create: {
      email: 'demo@freelanceos.com',
      password: hashedPassword,
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      currency: 'NGN',
      timezone: 'Africa/Lagos',
      avatar: 'https://ui-avatars.com/api/?background=0D9488&color=fff&name=Chidi+Okonkwo',
    },
  });

  console.log(`✅ Created user: ${user.email}`);

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'TechStack Nigeria',
        email: 'hello@techstack.ng',
        company: 'TechStack Nigeria Ltd',
        phone: '+234 802 345 6789',
        country: 'NG',
        avatar: 'https://ui-avatars.com/api/?background=3B82F6&color=fff&name=TS',
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'Sarah Johnson',
        email: 'sarah@creativemind.com',
        company: 'Creative Mind Agency',
        phone: '+1 415 555 0123',
        country: 'US',
        avatar: 'https://ui-avatars.com/api/?background=EF4444&color=fff&name=SJ',
      },
    }),
    prisma.client.create({
      data: {
        userId: user.id,
        name: 'James Omondi',
        email: 'james@africastartups.ke',
        company: 'Africa Startups',
        phone: '+254 712 345 678',
        country: 'KE',
        avatar: 'https://ui-avatars.com/api/?background=10B981&color=fff&name=JO',
      },
    }),
  ]);

  console.log(`✅ Created ${clients.length} clients`);

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        userId: user.id,
        clientId: clients[0].id,
        name: 'E-commerce Platform Redesign',
        description: 'Complete overhaul of the e-commerce platform with modern UI/UX and improved performance',
        status: 'active',
        budget: 450000,
        currency: 'NGN',
        deadline: new Date('2026-05-15'),
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        clientId: clients[1].id,
        name: 'Mobile App Development',
        description: 'React Native mobile app for iOS and Android',
        status: 'planning',
        budget: 8500,
        currency: 'USD',
        deadline: new Date('2026-06-30'),
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        clientId: clients[2].id,
        name: 'Website Migration Project',
        description: 'Migrate website from WordPress to Next.js',
        status: 'completed',
        budget: 250000,
        currency: 'KES',
        deadline: new Date('2026-02-28'),
      },
    }),
    prisma.project.create({
      data: {
        userId: user.id,
        clientId: clients[0].id,
        name: 'SEO Optimization',
        description: 'Technical SEO audit and implementation',
        status: 'on_hold',
        budget: 150000,
        currency: 'NGN',
        deadline: new Date('2026-04-20'),
      },
    }),
  ]);

  console.log(`✅ Created ${projects.length} projects`);

  // Create milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        projectId: projects[0].id,
        name: 'UI/UX Design Phase',
        description: 'Complete wireframes and high-fidelity designs',
        amount: 150000,
        dueDate: new Date('2026-03-25'),
        status: 'pending',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: projects[0].id,
        name: 'Frontend Development',
        description: 'Implement all pages and components',
        amount: 200000,
        dueDate: new Date('2026-04-15'),
        status: 'pending',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: projects[0].id,
        name: 'Backend Integration',
        description: 'Connect to backend API and implement features',
        amount: 100000,
        dueDate: new Date('2026-05-01'),
        status: 'pending',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: projects[1].id,
        name: 'App Architecture Design',
        description: 'Design system architecture and database schema',
        amount: 2500,
        dueDate: new Date('2026-04-10'),
        status: 'pending',
      },
    }),
    prisma.milestone.create({
      data: {
        projectId: projects[2].id,
        name: 'Development Phase',
        description: 'Complete website migration',
        amount: 200000,
        dueDate: new Date('2026-02-15'),
        completedAt: new Date('2026-02-14'),
        status: 'completed',
      },
    }),
  ]);

  console.log(`✅ Created ${milestones.length} milestones`);

  // Create invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clients[2].id,
        projectId: projects[2].id,
        number: 'INV-2026-001',
        amount: 250000,
        currency: 'KES',
        status: 'paid',
        issueDate: new Date('2026-02-01'),
        dueDate: new Date('2026-02-28'),
        paidAt: new Date('2026-02-20'),
        items: JSON.stringify([
          { description: 'Website Migration', quantity: 1, rate: 250000 },
        ]),
        notes: 'Thank you for your business!',
      },
    }),
    prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clients[0].id,
        projectId: projects[0].id,
        number: 'INV-2026-002',
        amount: 450000,
        currency: 'NGN',
        status: 'sent',
        issueDate: new Date('2026-03-01'),
        dueDate: new Date('2026-03-31'),
        items: JSON.stringify([
          { description: 'E-commerce Redesign - Initial Deposit', quantity: 1, rate: 150000 },
          { description: 'UI/UX Design Phase', quantity: 1, rate: 300000 },
        ]),
        taxRate: 7.5,
      },
    }),
    prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clients[1].id,
        number: 'INV-2026-003',
        amount: 4250,
        currency: 'USD',
        status: 'draft',
        issueDate: new Date('2026-03-10'),
        dueDate: new Date('2026-04-10'),
        items: JSON.stringify([
          { description: 'Mobile App Development - Phase 1', quantity: 1, rate: 4250 },
        ]),
      },
    }),
    prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clients[0].id,
        number: 'INV-2026-004',
        amount: 150000,
        currency: 'NGN',
        status: 'overdue',
        issueDate: new Date('2026-02-15'),
        dueDate: new Date('2026-03-01'),
        items: JSON.stringify([
          { description: 'SEO Optimization Services', quantity: 1, rate: 150000 },
        ]),
      },
    }),
    prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: clients[1].id,
        number: 'INV-2026-005',
        amount: 1500,
        currency: 'USD',
        status: 'paid',
        issueDate: new Date('2026-01-15'),
        dueDate: new Date('2026-01-30'),
        paidAt: new Date('2026-01-28'),
        items: JSON.stringify([
          { description: 'Consultation Services', quantity: 5, rate: 300 },
        ]),
      },
    }),
  ]);

  console.log(`✅ Created ${invoices.length} invoices`);

  // Create proposals
  const proposals = await Promise.all([
    prisma.proposal.create({
      data: {
        userId: user.id,
        clientId: clients[0].id,
        title: 'E-commerce Platform Enhancement',
        content: 'Proposal for adding new features including AI-powered recommendations, advanced analytics dashboard, and mobile app integration.',
        status: 'accepted',
        amount: 600000,
        currency: 'NGN',
        validUntil: new Date('2026-04-30'),
      },
    }),
    prisma.proposal.create({
      data: {
        userId: user.id,
        clientId: clients[1].id,
        title: 'Website Redesign Proposal',
        content: 'Complete website redesign with modern design system, improved UX, and CMS integration.',
        status: 'sent',
        amount: 12000,
        currency: 'USD',
        validUntil: new Date('2026-04-15'),
      },
    }),
    prisma.proposal.create({
      data: {
        userId: user.id,
        clientId: clients[2].id,
        title: 'Mobile App Development',
        content: 'Develop a mobile app for customer engagement with push notifications and loyalty program.',
        status: 'draft',
        amount: 350000,
        currency: 'KES',
        validUntil: new Date('2026-05-01'),
      },
    }),
  ]);

  console.log(`✅ Created ${proposals.length} proposals`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });