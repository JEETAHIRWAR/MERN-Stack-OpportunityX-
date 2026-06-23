# OpportunityX Deployment Guide

## Recommended Topology

- Frontend: Vercel, Netlify, or Render Static Site
- Backend: Render Web Service or another Node.js host
- Database: MongoDB Atlas

## Backend

Root directory:

```text
backend
```

Commands:

```bash
npm ci
npm start
```

Health check:

```text
/api/health
```

Set every production variable documented in `backend/.env.sample`. Use exact
comma-separated frontend origins in `CORS_ORIGINS`; wildcards are intentionally
not accepted. On Render, set `TRUST_PROXY_HOPS=1`.

Before the first upgraded production deployment:

1. Back up MongoDB.
2. Restore the backup into staging.
3. Set `MIGRATION_MONGODB_URI` to staging and `LEGACY_JOB_OWNER_ID`.
4. Run `npm run migrate:legacy`.
5. Review ambiguous/unmatched application logs.
6. Run `npm run migrate:legacy:execute` only after review.
7. Repeat the backup/dry-run/execute process for production.

## Frontend

Root directory:

```text
frontend
```

Build:

```bash
npm ci
npm run build
```

Publish directory:

```text
dist
```

Environment:

```env
VITE_API_BASE_URL=https://api.example.com/api
```

Configure the host to rewrite unknown frontend routes to `/index.html`.

## Optional production services

Managed uploads:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

AI:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
```

SMTP enables email verification and password reset:

```env
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
```

Socket.IO uses the same backend origin and exact `CORS_ORIGINS` allowlist. Hosts
must support WebSocket upgrades. Render and Railway web services support this;
do not deploy the Socket.IO backend as a static or serverless-only site.

Use separate databases, JWT secrets, frontend origins, storage folders, and API
keys for staging and production.

## Verification

```bash
cd backend
npm test

cd ../frontend
npm run lint
npm run build
```

Confirm that no `.env` file is tracked:

```bash
git ls-files | findstr /R /C:"\\.env$"
```
