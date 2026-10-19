# Security Policy

## Reporting a Vulnerability

If you find a security issue, please open a private security advisory on the
GitHub repository rather than a public issue, or email the maintainer. We aim to
respond within 72 hours.

## Known Limitations (read before deploying)

This project was built for a hackathon and is being hardened for production. Be
aware of the following before exposing it publicly:

- **Secrets in `.env`.** Never commit real credentials. If a `JWT_SECRET` or
  `DATABASE_URL` has ever been committed to history, rotate it. `.env` is
  gitignored; only `.env.example` should ever be tracked.
- **Raenest payments are mocked.** `src/services/raenest.service.ts` returns
  placeholder payment links and its webhook handler does not verify signatures.
  Do not process real payments until a real integration (with signature
  verification) is wired in.
- **Token storage (client side).** Tokens are stored in `localStorage` in the
  frontend, which is readable by JavaScript and therefore exposed to XSS. The
  recommended production hardening is server-set `httpOnly` cookies.
- **No automated tests yet.** Treat changes to services (invoice totals,
   ownership checks) with extra care.

## Recommended Hardening

- Rotate `JWT_SECRET` and the database password; keep them only in the host's
  environment variables (Render/Vercel dashboards), never in git.
- Serve the API over HTTPS only and set a strict `FRONTEND_URL` for CORS.
- Add httpOnly cookie auth + CSRF protection for the frontend.
- Add rate-limit tests and integration tests for auth and invoice flows.
