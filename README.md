<div align="center">

# FreelanceOS API

### Production-grade REST API for African Freelancers

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Hackathon](https://img.shields.io/badge/DevCareer_×_Raenest-Hackathon_2026-orange?style=flat-square)](https://devcareer.io)

<br />

**[🌐 Live Demo](https://freelance-os-ten.vercel.app/) · [📡 Live API](https://frealanceos-api.onrender.com) · [📖 API Docs](https://freelance-os-ten.vercel.app/docs) · [⚙️ Frontend Repo](#)**

</div>

---

## Overview

This is the backend API powering [FreelanceOS](https://freelance-os-ten.vercel.app/) - a freelancer management platform built for the DevCareer × Raenest Hackathon 2026.

It handles authentication, client/project/invoice/proposal management, dashboard analytics, and Raenest payment link generation.

**Base URL:** `https://frealanceos-api.onrender.com/api/v1`

---

## Tech Stack

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| **Node.js 20+**        | Runtime                           |
| **Express 4.21**       | HTTP framework                    |
| **TypeScript 5.0**     | Type safety throughout            |
| **Prisma 5.22**        | ORM - type-safe database queries  |
| **PostgreSQL (Neon)**  | Primary database                  |
| **JWT**                | Authentication - 7-day tokens     |
| **bcryptjs**           | Password hashing                  |
| **Zod**                | Request validation via validators |
| **Helmet 7**           | Security headers                  |
| **express-rate-limit** | Rate limiting                     |
| **ESLint + Prettier**  | Code quality                      |

---

## Project Structure

```
freelanceos-backend/
├── prisma/
│   ├── migrations/            # Database migration history
│   ├── schema.prisma          # DB schema - models, enums, relations
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── index.ts               # Entry point - DB connect + server start
│   ├── server.ts              # Express app - middleware + route wiring
│   ├── config/
│   │   ├── database.ts        # Prisma client singleton
│   │   └── env.ts             # Environment variable validation
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification middleware
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── rateLimiter.ts     # Rate limiting config
│   │   └── validation.ts      # Zod validation middleware
│   ├── routes/
│   │   ├── index.ts           # Route aggregator
│   │   ├── auth.ts
│   │   ├── clients.ts
│   │   ├── dashboard.ts
│   │   ├── invoices.ts
│   │   ├── milestones.ts
│   │   ├── projects.ts
│   │   └── proposals.ts
│   ├── controllers/           # Request/response handling per resource
│   ├── services/              # Business logic per resource
│   ├── validators/            # Zod schemas per resource
│   └── utils/
│       ├── jwt.ts             # JWT sign/verify helpers
│       ├── bcrypt.ts          # Password hashing helpers
│       └── request-helpers.ts # Shared request utilities
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) account (free tier works)
- Git

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/freelanceos-backend.git
cd freelanceos-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values - see [Environment Variables](#environment-variables) below for what each one does.

**Generate a JWT secret:**

```bash
# macOS / Linux / Git Bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

# OpenSSL
openssl rand -hex 48

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

### 3. Set up the database

```bash
# Run migrations - creates all tables
npm run db:migrate

# Load demo data
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
📝 Environment: development
🔗 Frontend URL: http://localhost:3000
```

### 5. Verify it works

```bash
# Health check
curl http://localhost:5000/api/v1/health

# Login with demo account
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@freelanceos.dev","password":"Demo@12345"}'
```

Save the `token` from the login response - pass it as `Authorization: Bearer <token>` on all protected routes.

---

## API Reference

All endpoints are prefixed with `/api/v1`. Full interactive docs at [freelance-os-ten.vercel.app/docs](https://freelance-os-ten.vercel.app/docs).

Every response follows:

```json
{ "success": true, "data": {} }
{ "success": false, "error": "Human-readable message" }
```

### Auth

| Method | Endpoint         | Auth | Description         |
| ------ | ---------------- | ---- | ------------------- |
| `POST` | `/auth/register` | ❌   | Create account      |
| `POST` | `/auth/login`    | ❌   | Login → returns JWT |
| `GET`  | `/auth/me`       | ✅   | Get current user    |
| `PUT`  | `/auth/profile`  | ✅   | Update profile      |
| `PUT`  | `/auth/password` | ✅   | Change password     |
| `PUT`  | `/auth/notifications` | ✅ | Update notification prefs |
| `DELETE` | `/auth/account` | ✅ | Soft-delete account (password + `DELETE` confirm) |

### Clients

| Method   | Endpoint       | Auth | Description      |
| -------- | -------------- | ---- | ---------------- |
| `GET`    | `/clients`     | ✅   | List all clients |
| `POST`   | `/clients`     | ✅   | Create a client  |
| `GET`    | `/clients/:id` | ✅   | Get one client   |
| `PUT`    | `/clients/:id` | ✅   | Update a client  |
| `DELETE` | `/clients/:id` | ✅   | Delete a client  |

### Projects

| Method   | Endpoint        | Auth | Description                      |
| -------- | --------------- | ---- | -------------------------------- |
| `GET`    | `/projects`     | ✅   | List projects (`?status=active`) |
| `POST`   | `/projects`     | ✅   | Create a project                 |
| `GET`    | `/projects/:id` | ✅   | Get one project                  |
| `PUT`    | `/projects/:id` | ✅   | Update a project                 |
| `DELETE` | `/projects/:id` | ✅   | Delete a project                 |

### Invoices

| Method   | Endpoint                     | Auth | Description                          |
| -------- | ---------------------------- | ---- | ------------------------------------ |
| `GET`    | `/invoices`                  | ✅   | List invoices (`?status=overdue`)    |
| `POST`   | `/invoices`                  | ✅   | Create invoice (auto-numbered)       |
| `GET`    | `/invoices/:id`              | ✅   | Get one invoice                      |
| `PUT`    | `/invoices/:id`              | ✅   | Update invoice                       |
| `DELETE` | `/invoices/:id`              | ✅   | Delete invoice                       |
| `POST`   | `/invoices/:id/send`         | ✅   | Mark as sent + build payment link    |
| `POST`   | `/invoices/:id/mark-paid`    | ✅   | Mark as paid                         |
| `POST`   | `/invoices/:id/payment-link` | ✅   | Build payment link (placeholder URL) |

### Milestones

| Method   | Endpoint          | Auth | Description                        |
| -------- | ----------------- | ---- | ---------------------------------- |
| `GET`    | `/milestones`     | ✅   | List milestones (`?projectId=...`) |
| `POST`   | `/milestones`     | ✅   | Create a milestone                 |
| `PUT`    | `/milestones/:id` | ✅   | Update a milestone                 |
| `DELETE` | `/milestones/:id` | ✅   | Delete a milestone                 |

### Proposals

| Method   | Endpoint         | Auth | Description       |
| -------- | ---------------- | ---- | ----------------- |
| `GET`    | `/proposals`     | ✅   | List proposals    |
| `POST`   | `/proposals`     | ✅   | Create a proposal |
| `PUT`    | `/proposals/:id` | ✅   | Update a proposal |
| `DELETE` | `/proposals/:id` | ✅   | Delete a proposal |

### Dashboard

| Method | Endpoint              | Auth | Description                             |
| ------ | --------------------- | ---- | --------------------------------------- |
| `GET`  | `/dashboard/stats`    | ✅   | All KPIs - earnings, projects, invoices |
| `GET`  | `/dashboard/earnings` | ✅   | Chart data (`?period=monthly\|weekly`)  |

### Notifications

| Method | Endpoint          | Auth | Description                                        |
| ------ | ----------------- | ---- | -------------------------------------------------- |
| `GET`  | `/notifications`  | ✅   | Derived feed (overdue, deadlines, proposals, paid) |
| `GET`  | `/dashboard/activity` | ✅   | Recent activity feed                    |

---

## Environment Variables

| Variable                  | Required | Default                      | Description                          |
| ------------------------- | -------- | ---------------------------- | ------------------------------------ |
| `DATABASE_URL`            | ✅       | -                            | Neon PostgreSQL connection string    |
| `JWT_SECRET`              | ✅       | -                            | Token signing key - min 32 chars     |
| `PORT`                    | ❌       | `5000`                       | Server port                          |
| `NODE_ENV`                | ❌       | `development`                | `development` or `production`        |
| `FRONTEND_URL`            | ❌       | `http://localhost:3000`      | CORS allowed origin                  |
| `RATE_LIMIT_WINDOW_MS`    | ❌       | `900000`                     | Rate limit window (default 15 min)   |
| `RATE_LIMIT_MAX_REQUESTS` | ❌       | `100`                        | Max requests per window per IP       |
| `RAENEST_API_KEY`         | ❌       | -                            | Reserved - Raenest is not called yet |
| `RAENEST_API_URL`         | ❌       | `https://api.raenest.com/v1` | Reserved - payment links are stubbed |

---

## Security

**JWT on every protected route** - The `auth` middleware verifies the token before any controller runs. Missing, expired, or tampered tokens are rejected with `401` immediately.

**User isolation on every query** - Every database query in every service filters by `userId` from the JWT. A user can never read or modify another user's data, even if they know the resource ID.

**Zod validation before DB access** - All request bodies pass through validators before reaching controllers. Unknown fields are stripped. Invalid types are rejected with a `400` and a clear error message.

**Rate limiting** - `express-rate-limit` applies 100 requests per 15 minutes per IP globally, configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` in `.env`. `/auth/login` and `/auth/register` get a separate, stricter limiter: 10 requests per 15 minutes per IP.

**Helmet** - Sets security headers on every response, including XSS protection, clickjacking prevention, and MIME-type sniffing protection.

**Password hashing** - bcrypt via `src/utils/bcrypt.ts`. Plain text passwords are never stored or logged.

**Identical auth error messages** - Wrong email and wrong password return the same response to prevent email enumeration attacks.

---

## Error Codes

| Code  | Meaning                                                     |
| ----- | ----------------------------------------------------------- |
| `400` | Bad Request - validation failed, missing required field     |
| `401` | Unauthorised - missing or invalid JWT                       |
| `403` | Forbidden - authenticated but accessing another user's data |
| `404` | Not Found - resource doesn't exist                          |
| `409` | Conflict - e.g. deleting a client with active projects      |
| `429` | Too Many Requests - rate limit hit                          |
| `500` | Internal Server Error - check server logs                   |

---

## Scripts

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run dev`         | Dev server with hot reload via `tsx watch`    |
| `npm run build`       | Compile TypeScript → `dist/`                  |
| `npm start`           | Run compiled production build                 |
| `npm run db:migrate`  | Run Prisma migrations                         |
| `npm run db:seed`     | Load demo data via `tsx`                     |
| `npm run db:studio`   | Open Prisma Studio - visual DB browser        |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run lint`        | Run ESLint across `src/`                      |
| `npm run format`      | Format all files with Prettier                |

---

## Deployment

This API is deployed on **Render**.

### Deploy to Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → connect your repo
3. Set **Build Command:**
   ```bash
   npm install && npm run build
   ```
4. Set **Start Command:**
   ```bash
   npm run db:migrate && npm start
   ```
5. Add environment variables under **Environment** tab - use the same values as your `.env` but with production values for `DATABASE_URL`, `FRONTEND_URL`, and `NODE_ENV=production`
6. Click **Deploy**

> After first deploy, the demo data won't be seeded automatically. You can run `npm run db:seed` once via Render's shell tab if needed.

### Environment variables for production

```
DATABASE_URL        = your Neon connection string
JWT_SECRET          = your generated secret (min 32 chars)
NODE_ENV            = production
PORT                = 5000
FRONTEND_URL        = https://freelance-os-ten.vercel.app
RATE_LIMIT_WINDOW_MS      = 900000
RATE_LIMIT_MAX_REQUESTS   = 100
```

---

## Troubleshooting

**`❌ Failed to start server` on launch**
Your `DATABASE_URL` is wrong or Neon is unreachable. Double-check the connection string - make sure it includes `?sslmode=require` at the end.

**`Prisma Client not generated`**
Run `npm run db:generate`. This happens if `postinstall` didn't run or the schema changed.

**`JWT_SECRET must be at least 32 characters`**
Generate a new one using the command in Step 2 above.

**Port already in use**

```bash
# macOS / Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**CORS errors in the browser**
Your `FRONTEND_URL` in `.env` doesn't exactly match your frontend's origin. No trailing slash. Check capitalisation.

---

## Related

- **[Frontend Repository](#)** - Next.js app
- **[Live Demo](https://freelance-os-ten.vercel.app/)** - See it in action
- **[API Documentation](https://freelance-os-ten.vercel.app/docs)** - Full interactive endpoint reference

---

## Acknowledgments

- [DevCareer](https://devcareer.io) for running the hackathon
- [Raenest](https://raenest.com) for the payment infrastructure
- [Neon](https://neon.tech) for serverless PostgreSQL

---

<div align="center">

Built for the **DevCareer × Raenest Hackathon 2026** · [Live Demo](https://freelance-os-ten.vercel.app/)

</div>
