# OpportunityX Next Steps

## Production Readiness Phase Completed

- Added a dry-run-first legacy migration with deterministic application linking.
- Added isolated MongoDB integration tests for auth safety, RBAC, recruiter
  ownership and verification, duplicate applications, saved jobs,
  notifications, migration behavior, and deletion cleanup.
- Added endpoint-specific rate limiting.
- Enabled Helmet with a restrictive content security policy.
- Added exact-origin CORS, structured JSON request logs, request IDs,
  centralized 404/error handling, and maintained rich-text sanitization.
- Added recruiter verification states and admin review APIs.
- Added user suspension/reactivation and role-management APIs.
- Added job lifecycle states, draft support, skills, employment type, and
  public pagination.
- Removed verified-unused compatibility pages/components and their ESLint
  exceptions.
- Added `DEPLOYMENT.md` and expanded environment configuration.

## Remaining Bugs and Migration Work

### 1. Execute the controlled legacy-data migration

The migration is implemented and integration-tested. Production still requires:

1. Back up MongoDB.
2. Restore into staging.
3. Set `MIGRATION_MONGODB_URI` and `LEGACY_JOB_OWNER_ID`.
4. Run `npm run migrate:legacy`.
5. Review ambiguous and unmatched application-email records.
6. Run `npm run migrate:legacy:execute`.
7. Repeat only after production backup approval.

### 2. Scale rate limiting

Current rate limits use process memory. Configure a shared Redis-compatible
store before running multiple backend instances.

### 3. Complete operational security

- Add automated dependency update review. The production dependency audit is
  currently clean; development tooling advisories should remain monitored.
- Connect structured logs to a managed log/error service.
- Add refresh-token rotation or secure HTTP-only cookie sessions.
- Add account email verification and recruiter official-email verification.

## Future Advanced Features

### Candidate features

- Direct PDF/DOCX resume upload.
- Resume preview and version management.
- Resume parsing for skills, education, and experience.
- Cover letters and application questions.
- Saved searches and email job alerts.
- AI-assisted job recommendations.
- Candidate dashboard analytics.

### Recruiter features

- Recruiter/admin approval workflow.
- Company verification.
- Multiple recruiters per company.
- Job draft, published, paused, and closed states.
- Applicant filters and bulk actions.
- Interview scheduling with calendar integration.
- Recruiter-candidate chat.
- Candidate pipeline board.
- Export applicants to CSV.

### Admin features

- Change user roles.
- Suspend/reactivate accounts.
- Moderate jobs and companies.
- Audit log.
- Platform conversion charts.
- Reported content workflow.
- Email template management.

### Notification features

- Notification dropdown and unread badge.
- Mark all as read.
- Email notifications for status changes.
- Real-time notifications through Socket.IO.

### Platform improvements

- Pagination for jobs, users, and applications.
- MongoDB Atlas Search or a dedicated search service.
- Salary, skills, employment type, and seniority fields.
- Accessibility review.
- Internationalization.
- SEO metadata and job structured data.
- Image optimization.
- Error monitoring and performance monitoring.

## Deployment Checklist

### Backend environment

- [ ] Set `PORT`.
- [ ] Set production `MONGODB_URI`.
- [ ] Set a long random `JWT_SECRET`.
- [ ] Set `ACCESS_TOKEN_EXPIRY`.
- [ ] Set exact frontend origins in `CORS_ORIGIN`.
- [ ] Set `CLIENT_URL`.
- [ ] Configure SMTP variables.
- [ ] Leave `ADMIN_REGISTRATION_CODE` empty unless controlled admin bootstrap is needed.
- [ ] Confirm MongoDB Atlas network access.
- [ ] Back up and migrate legacy database records.
- [ ] Verify database indexes build successfully.

### Frontend environment

- [ ] Set `VITE_API_BASE_URL` to the deployed backend `/api` URL.
- [ ] Add SPA rewrites to serve `index.html` for client routes.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.

### Security

- [ ] Use HTTPS only.
- [ ] Rotate any previously exposed credentials.
- [ ] Restrict CORS to exact production domains.
- [ ] Add rate limiting.
- [ ] Add Helmet/security headers.
- [ ] Confirm password-reset links use the production frontend URL.
- [ ] Confirm no `.env` files are committed.

### Operational readiness

- [ ] Configure `/api/health` as the service health check.
- [ ] Add centralized logs.
- [ ] Add error monitoring.
- [ ] Add database backups.
- [ ] Add CI for lint, build, syntax, and tests.
- [ ] Test candidate, recruiter, and admin journeys in staging.
- [ ] Test mobile layouts in real browsers.
# Product UI Upgrade Follow-up — 2026-06-21

## Completed

- [x] Responsive role-aware navigation and account menu.
- [x] Shared SaaS UI primitives and accessible focus treatment.
- [x] Candidate, recruiter, and admin workspace shells.
- [x] Dedicated recruiter company profile and verification status UI.
- [x] Frontend publishing guard aligned with backend verification enforcement.
- [x] API-backed landing page and dashboards with no fabricated metrics.
- [x] Unified sign-in and registration visual system.

## Remaining production work

- [ ] Add managed file storage for resumes and company logos; current models use URLs.
- [ ] Add email verification/OTP only after a real mail-delivery and token lifecycle is designed.
- [ ] Build messaging, analytics charts, and notification preferences only with
      corresponding persisted models and APIs.
- [ ] Add accessible custom confirmation/rejection dialogs to replace browser prompts.
- [ ] Add end-to-end browser tests for candidate, recruiter, and admin journeys.
- [ ] Configure `VITE_API_BASE_URL` in the Render frontend build environment and
      exact frontend origins in backend `CORS_ORIGINS`.

## Enterprise follow-up

- [x] Email verification lifecycle.
- [x] Password change and persisted preferences.
- [x] Job alerts and application withdrawal.
- [x] Application-scoped messaging persistence.
- [x] Authenticated Socket.IO rooms, typing events, and real-time notifications.
- [x] Managed Cloudinary resume/logo uploads.
- [x] Job moderation, reports, and historical analytics.
- [x] Replaceable OpenAI Responses API provider and persisted AI insights.
- [ ] Extract PDF/DOCX text and add malware scanning.
- [ ] Add refresh-token rotation with HTTP-only cookies.
- [ ] Add shared Redis stores for rate limits, Socket.IO, and background jobs.
- [ ] Add AI schema validation, usage budgets, evaluations, and streaming.
- [ ] Complete the incremental TypeScript/shadcn migration.
- [ ] Add component and Playwright end-to-end tests.
