# FreelanceOS API Documentation

> Complete reference for the FreelanceOS backend API.
> **Base URL:** `https://frealanceos-api.onrender.com/api/v1`
> **Frontend:** [freelance-os-ten.vercel.app](https://freelance-os-ten.vercel.app)

---

## Contents

- [Introduction](#introduction)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Rate Limits](#rate-limits)
- [Endpoints](#endpoints)
  - [Auth](#auth-endpoints)
  - [Clients](#clients)
  - [Projects](#projects)
  - [Invoices](#invoices)
  - [Milestones](#milestones)
  - [Proposals](#proposals)
  - [Dashboard](#dashboard)
- [Error Codes](#error-codes)
- [Environment Variables](#environment-variables)

---

## Introduction

FreelanceOS API is a RESTful backend built for African freelancers to manage clients, projects, and invoices, with link-shaped payment URLs for the Raenest checkout (Raenest API integration pending).

Every endpoint follows a consistent response format. Protected routes require a JWT Bearer token.

**Local development base URL:** `http://localhost:5000/api/v1`

---

## Authentication

Most endpoints require a JWT token. Obtain one via `POST /auth/login` or `POST /auth/register`.

Include it on every protected request:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Tokens expire after **7 days**. When a token expires, the client receives `401` and should redirect to login.

---

## Response Format

Every response - success or error - follows this shape:

```json
// Success
{
  "success": true,
  "data": { }
}

// Error
{
  "success": false,
  "error": "Human-readable error message"
}
```

There are no other response shapes. If `success` is `true`, `data` is always present. If `success` is `false`, `error` is always present.

---

## Rate Limits

| Scope             | Limit                              |
| ----------------- | ---------------------------------- |
| All endpoints     | 100 requests per 15 minutes per IP |
| `/auth` endpoints | 10 requests per 15 minutes per IP  |

Rate limit status is returned in response headers:

```
RateLimit-Limit: 100
RateLimit-Remaining: 87
RateLimit-Reset: 1711234567
```

When exceeded, the API returns `429 Too Many Requests`.

---

## Endpoints

### Auth Endpoints

---

#### `POST /auth/register`

Create a new user account.

**No authentication required.**

**Request body:**

```json
{
  "email": "you@example.com",
  "password": "SecurePass1",
  "firstName": "Bello",
  "lastName": "Demo"
}
```

| Field       | Type   | Required | Rules                              |
| ----------- | ------ | -------- | ---------------------------------- |
| `email`     | string | ✅       | Valid email format                 |
| `password`  | string | ✅       | Min 8 chars, 1 uppercase, 1 number |
| `firstName` | string | ✅       | Max 100 chars                      |
| `lastName`  | string | ✅       | Max 100 chars                      |

**Response `201`:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx1a2b3c4",
      "email": "you@example.com",
      "firstName": "Bello",
      "lastName": "Demo",
      "createdAt": "2026-03-24T10:00:00.000Z"
    }
  }
}
```

---

#### `POST /auth/login`

Authenticate and receive a JWT token.

**No authentication required.**

**Request body:**

```json
{
  "email": "you@example.com",
  "password": "SecurePass1"
}
```

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx1a2b3c4",
      "email": "you@example.com",
      "firstName": "Bello",
      "lastName": "Demo",
      "createdAt": "2026-03-24T10:00:00.000Z"
    }
  }
}
```

> **Security note:** Wrong email and wrong password return the same error message (`"Invalid email or password"`) to prevent email enumeration.

---

#### `GET /auth/me`

Get the currently authenticated user's profile.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "id": "clx1a2b3c4",
    "email": "you@example.com",
    "firstName": "Bello",
    "lastName": "Demo",
    "createdAt": "2026-03-24T10:00:00.000Z",
    "_count": {
      "clients": 3,
      "projects": 4,
      "invoices": 6
    }
  }
}
```

---

### Clients

---

#### `GET /clients`

List all clients for the authenticated user.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "Tunde Adeyemi",
      "email": "tunde@techstartng.com",
      "company": "TechStart Nigeria",
      "country": "NG",
      "totalBilled": 6750,
      "avatar": "https://ui-avatars.com/...",
      "_count": { "projects": 2, "invoices": 3 },
      "createdAt": "2026-01-15T00:00:00.000Z"
    }
  ]
}
```

> `totalBilled` is computed from paid invoices - it is never stored directly and is always accurate.

---

#### `POST /clients`

Create a new client.

**🔒 Authentication required.**

**Request body:**

```json
{
  "name": "Tunde Adeyemi",
  "email": "tunde@techstartng.com",
  "company": "TechStart Nigeria",
  "phone": "+234 801 234 5678",
  "country": "NG",
  "notes": "Prefers WhatsApp. Pays within 7 days."
}
```

| Field     | Type   | Required |
| --------- | ------ | -------- | ----------------------------------------- |
| `name`    | string | ✅       |
| `email`   | string | ✅       |
| `company` | string | ❌       |
| `phone`   | string | ❌       |
| `country` | string | ❌       | 2-letter ISO code (e.g. `NG`, `US`, `GB`) |
| `notes`   | string | ❌       |

**Response `201`:** Created client object.

---

#### `GET /clients/:id`

Get a single client with their full project and invoice history.

**🔒 Authentication required.**

**Response `200`:** Client object with nested `projects[]` and `invoices[]`.

---

#### `PUT /clients/:id`

Update a client. All fields are optional - only send what you want to change.

**🔒 Authentication required.**

---

#### `DELETE /clients/:id`

Delete a client.

**🔒 Authentication required.**

> Returns `409 Conflict` if the client has existing projects, invoices, or proposals. Remove those first.

---

### Projects

---

#### `GET /projects`

List all projects. Optional query parameters:

| Param    | Example          | Description      |
| -------- | ---------------- | ---------------- |
| `status` | `?status=active` | Filter by status |

**🔒 Authentication required.**

Each project includes `milestoneProgress` - the percentage of milestones marked complete.

---

#### `POST /projects`

Create a new project.

**🔒 Authentication required.**

**Request body:**

```json
{
  "clientId": "clx...",
  "name": "E-commerce Platform Redesign",
  "description": "Full redesign with new checkout flow",
  "status": "planning",
  "budget": 4500,
  "currency": "USD",
  "deadline": "2026-04-15T00:00:00Z"
}
```

| Field         | Type   | Required | Notes                                 |
| ------------- | ------ | -------- | ------------------------------------- |
| `clientId`    | string | ✅       | Must belong to the authenticated user |
| `name`        | string | ✅       |                                       |
| `description` | string | ❌       |                                       |
| `status`      | string | ❌       | Default: `planning`                   |
| `budget`      | number | ❌       | Positive number                       |
| `currency`    | string | ❌       | 3-letter code. Default: `USD`         |
| `deadline`    | string | ❌       | ISO 8601 datetime                     |

**Status values:** `planning` · `active` · `on_hold` · `completed` · `cancelled`

---

#### `GET /projects/:id`

Get a single project with milestones and invoices.

**🔒 Authentication required.**

---

#### `PUT /projects/:id`

Update a project. All fields optional.

**🔒 Authentication required.**

---

#### `DELETE /projects/:id`

Delete a project. Milestones are cascade-deleted. Linked invoices have their `projectId` set to `null`.

**🔒 Authentication required.**

---

### Invoices

---

#### `GET /invoices`

List all invoices. Optional query parameters:

| Param      | Example            | Description      |
| ---------- | ------------------ | ---------------- |
| `status`   | `?status=overdue`  | Filter by status |
| `clientId` | `?clientId=clx...` | Filter by client |

**🔒 Authentication required.**

---

#### `POST /invoices`

Create a new invoice. Invoice number is auto-generated in the format `INV-YYYY-NNN`.

**🔒 Authentication required.**

**Request body:**

```json
{
  "clientId": "clx...",
  "projectId": "clx...",
  "amount": 2250,
  "currency": "USD",
  "status": "draft",
  "issueDate": "2026-03-01T00:00:00Z",
  "dueDate": "2026-03-15T00:00:00Z",
  "items": [
    {
      "description": "UI Design - Phase 1",
      "quantity": 1,
      "rate": 1500,
      "amount": 1500
    },
    {
      "description": "Prototype & handoff",
      "quantity": 1,
      "rate": 750,
      "amount": 750
    }
  ],
  "notes": "Payment due within 15 days"
}
```

| Field       | Type   | Required | Notes                                 |
| ----------- | ------ | -------- | ------------------------------------- |
| `clientId`  | string | ✅       | Must belong to the authenticated user |
| `projectId` | string | ❌       | Optional project link                 |
| `amount`    | number | ✅       | Total invoice amount                  |
| `currency`  | string | ❌       | Default: `USD`                        |
| `status`    | string | ❌       | Default: `draft`                      |
| `issueDate` | string | ✅       | ISO 8601                              |
| `dueDate`   | string | ❌       | ISO 8601                              |
| `items`     | array  | ✅       | Min 1 item                            |
| `notes`     | string | ❌       |                                       |

**Status values:** `draft` · `sent` · `paid` · `overdue` · `cancelled`

---

#### `GET /invoices/:id`

Get a single invoice with client and project details.

**🔒 Authentication required.**

---

#### `PUT /invoices/:id`

Update an invoice.

**🔒 Authentication required.**

> Returns `409 Conflict` if the invoice status is `paid` - paid invoices are immutable for financial integrity.

> Setting `status` to `"paid"` automatically records `paidAt` as the current timestamp.

---

#### `DELETE /invoices/:id`

Delete an invoice.

**🔒 Authentication required.**

> Returns `409 Conflict` if the invoice is `paid` - delete is blocked to preserve the audit trail. Use `status: "cancelled"` instead.

---

#### `POST /invoices/:id/send`

Move a `draft` invoice to `sent`.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": { "...updated invoice with status: sent..." }
}
```

> Only `draft` invoices can be sent (`400` otherwise). No email is sent yet and no payment link is created here - use the payment-link endpoint below.

---

#### `POST /invoices/:id/payment-link`

Build and persist a payment link for the invoice.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "paymentLink": "https://pay.raenest.com/freelanceos/cmvd0abc000000000000inv1?amount=2250&currency=USD",
    "link": "https://pay.raenest.com/freelanceos/cmvd0abc000000000000inv1?amount=2250&currency=USD"
  }
}
```

> The URL is link-shaped but **not a working checkout**: the Raenest API is not called yet (no API keys). Both `paymentLink` and `link` hold the same value - the frontend reads either.

---

### Milestones

---

#### `GET /milestones`

List milestones. Optional query parameter:

| Param       | Example             | Description           |
| ----------- | ------------------- | --------------------- |
| `projectId` | `?projectId=clx...` | Filter to one project |

**🔒 Authentication required.**

---

#### `POST /milestones`

Create a milestone.

**🔒 Authentication required.**

**Request body:**

```json
{
  "projectId": "clx...",
  "name": "Design Phase - Wireframes",
  "description": "Deliver all Figma screens for review",
  "amount": 1500,
  "status": "pending",
  "dueDate": "2026-04-01T00:00:00Z"
}
```

**Status values:** `pending` · `in_progress` · `completed`

---

#### `PUT /milestones/:id`

Update a milestone.

**🔒 Authentication required.**

> Setting `status` to `"completed"` automatically records `completedAt`. Changing it back to `pending` or `in_progress` clears `completedAt`.

---

#### `DELETE /milestones/:id`

Delete a milestone.

**🔒 Authentication required.**

---

### Proposals

---

#### `GET /proposals`

List all proposals. Optional query parameter:

| Param    | Example        | Description      |
| -------- | -------------- | ---------------- |
| `status` | `?status=sent` | Filter by status |

**🔒 Authentication required.**

---

#### `POST /proposals`

Create a proposal.

**🔒 Authentication required.**

**Request body:**

```json
{
  "clientId": "clx...",
  "title": "API Integration Suite - Project Proposal",
  "content": "This proposal outlines...",
  "amount": 3500,
  "currency": "USD",
  "status": "draft",
  "validUntil": "2026-04-15T00:00:00Z",
  "notes": "Price valid for 30 days"
}
```

**Status values:** `draft` · `sent` · `accepted` · `rejected`

---

#### `PUT /proposals/:id`

Update a proposal. All fields optional.

**🔒 Authentication required.**

---

#### `DELETE /proposals/:id`

Delete a proposal.

**🔒 Authentication required.**

---

### Dashboard

---

#### `GET /dashboard/stats`

Returns all KPIs needed for the main dashboard. All queries run in parallel - single round trip.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": {
    "totalEarnings": 45250.75,
    "monthlyEarnings": 8750.5,
    "earningsGrowth": 23.5,
    "activeProjects": 4,
    "activeProjectsGrowth": 2,
    "pendingInvoices": 3,
    "pendingInvoicesAmount": 12500.0,
    "overdueInvoices": 1,
    "overdueInvoicesAmount": 6500.0,
    "recentClients": [
      {
        "id": "clx...",
        "name": "Tunde Adeyemi",
        "company": "TechStart Nigeria",
        "createdAt": "2026-03-01T00:00:00Z"
      }
    ],
    "upcomingDeadlines": [
      {
        "id": "clx...",
        "type": "invoice",
        "title": "INV-2026-002",
        "date": "2026-03-25T00:00:00Z",
        "amount": 4000,
        "clientName": "Paystack Ventures"
      }
    ]
  }
}
```

**Field notes:**

- `earningsGrowth` - percentage change vs previous month. Returns `100` if last month was `0` and this month is positive. Returns `0` if both months are `0`.
- `overdueInvoices` - union of invoices explicitly marked `overdue` AND invoices with `status: "sent"` where `dueDate` is in the past.
- `upcomingDeadlines` - next 5 items across projects, invoices, and milestones sorted by date ascending.

---

#### `GET /dashboard/earnings`

Earnings chart data broken down by period.

**🔒 Authentication required.**

**Query parameters:**

| Param    | Values              | Default   | Description                                        |
| -------- | ------------------- | --------- | -------------------------------------------------- |
| `period` | `monthly`, `weekly` | `monthly` | `monthly` = last 6 months. `weekly` = last 8 weeks |

**Response `200`:**

```json
{
  "success": true,
  "data": [
    { "month": "Oct 2025", "date": "2025-10-01T00:00:00.000Z", "amount": 3200 },
    { "month": "Nov 2025", "date": "2025-11-01T00:00:00.000Z", "amount": 4800 },
    { "month": "Dec 2025", "date": "2025-12-01T00:00:00.000Z", "amount": 5200 },
    { "month": "Jan 2026", "date": "2026-01-01T00:00:00.000Z", "amount": 6100 },
    { "month": "Feb 2026", "date": "2026-02-01T00:00:00.000Z", "amount": 7250 },
    { "month": "Mar 2026", "date": "2026-03-01T00:00:00.000Z", "amount": 8750 }
  ]
}
```

---

#### `GET /dashboard/activity`

Recent activity feed - last 20 events across invoices, projects, clients, and milestones, sorted by most recent first.

**🔒 Authentication required.**

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "act_inv_clx...",
      "type": "invoice_paid",
      "message": "Invoice INV-2026-001 was paid",
      "timestamp": "2026-03-10T14:30:00.000Z",
      "amount": 2250,
      "clientName": "TechStart Nigeria",
      "entityId": "clx..."
    },
    {
      "id": "act_proj_clx...",
      "type": "project_created",
      "message": "Project \"API Integration Suite\" created",
      "timestamp": "2026-02-20T09:15:00.000Z",
      "clientName": "TechStart Nigeria",
      "entityId": "clx..."
    }
  ]
}
```

**Activity type values:** `invoice_paid` · `invoice_sent` · `invoice_draft` · `invoice_overdue` · `project_created` · `client_added` · `milestone_completed`

---

## Error Codes

| Code  | Meaning               | Common Causes                                                  |
| ----- | --------------------- | -------------------------------------------------------------- |
| `400` | Bad Request           | Validation failed, missing required field, invalid format      |
| `401` | Unauthorized          | Missing `Authorization` header, expired token, invalid token   |
| `403` | Forbidden             | Authenticated but accessing another user's data                |
| `404` | Not Found             | Resource doesn't exist or belongs to a different user          |
| `409` | Conflict              | Editing a paid invoice, deleting a client with active projects |
| `429` | Too Many Requests     | Rate limit exceeded - wait and retry                           |
| `500` | Internal Server Error | Something broke server-side - check logs                       |

---

## Environment Variables

| Variable                  | Required | Default                   | Description                                                 |
| ------------------------- | -------- | ------------------------- | ----------------------------------------------------------- |
| `DATABASE_URL`            | ✅       | -                         | PostgreSQL connection string                                |
| `JWT_SECRET`              | ✅       | -                         | Token signing key - min 32 chars                            |
| `PORT`                    | ❌       | `5000`                    | Server port                                                 |
| `NODE_ENV`                | ❌       | `development`             | `development` or `production`                               |
| `FRONTEND_URL`            | ❌       | `http://localhost:3000`   | CORS allowed origin                                         |
| `RATE_LIMIT_WINDOW_MS`    | ❌       | `900000`                  | Global rate limit window (15 min)                           |
| `RATE_LIMIT_MAX_REQUESTS` | ❌       | `100`                     | Global requests per window per IP                           |
| `RAENEST_API_KEY`         | ❌       | -                         | Reserved - Raenest is not called yet                        |
| `RAENEST_API_URL`         | ❌       | `https://api.raenest.com/v1` | Reserved - payment links are stubbed                      |

> Tokens expire after 7 days (`expiresIn: '7d'` in `src/utils/jwt.ts`).

### Generate JWT_SECRET

```bash
# macOS / Linux / Git Bash
openssl rand -base64 64

# Node.js (any platform)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

---

_Questions? Open an issue on [GitHub](https://github.com/Sallah10/frealanceOs-Api/issues)._
