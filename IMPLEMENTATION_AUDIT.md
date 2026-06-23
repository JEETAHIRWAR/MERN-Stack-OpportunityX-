# OpportunityX Implementation Audit

Audit date: June 21, 2026

This audit is based on the repository, not aspirational documentation.

## Implemented

### Platform foundation

- MERN application with React, Tailwind CSS, Express, Mongoose, and MongoDB.
- JWT authentication with password hashing and safe auth response shaping.
- Candidate, recruiter, and admin roles with backend authorization middleware.
- Helmet, exact-origin CORS, request logging, rate limiting, centralized errors,
  ObjectId validation, rich-text sanitization, and `/api/health`.
- Environment-driven frontend API URL and production deployment guidance.
- Legacy-data migration with dry-run support.
- Isolated backend integration tests using an in-memory MongoDB database.

### Candidate

- Registration, login, forgot password, and password reset.
- Candidate profile create/update.
- Browse, search, filter, save, unsave, and apply to jobs.
- Duplicate application prevention.
- Saved jobs, application history, status badges, notifications, dashboard
  totals, profile completion, and basic skill-based recommendations.

### Recruiter

- Registration and role authorization.
- Company/recruiter profile.
- Verification states: `unverified`, `pending`, `verified`, `rejected`.
- Required-field validation, admin review notes, rejection reason, resubmission.
- Draft job support and verified-recruiter enforcement for publishing.
- Own-job management, applicant access, status updates, recruiter notes, and
  API-derived dashboard totals.

### Admin

- API-derived dashboard totals.
- User role and suspension management.
- Recruiter approval/rejection.
- Platform-wide jobs and applications access.

## Partially implemented

- Recommendations use profile text search, not a persisted ranking engine.
- Analytics expose current totals and pipeline breakdowns, not historical series.
- Notifications are persisted and readable but are not pushed in real time.
- Resume and company logo fields accept URLs but do not manage binary uploads.
- Admin can edit/delete jobs but there is no moderation audit state.
- Settings routes exist as requirement states but have no preferences model.
- Candidate public profile data exists but has no public username route.
- Job lifecycle states exist, but scheduled publishing and audit history do not.
- Frontend is responsive React/JavaScript, not the requested TypeScript/shadcn
  rebuild.

## Missing

- Email OTP verification and resend lifecycle.
- Managed resume/logo uploads, preview, parsing, and malware/type validation.
- Withdraw application.
- Candidate job alerts and persisted search history.
- Conversations, messages, typing, presence, attachments, and read receipts.
- Password-change endpoint and persisted notification/appearance preferences.
- Account deletion workflow.
- Historical recruiter/admin analytics and downloadable reports.
- Job moderation states: pending, approved, flagged, rejected.
- AI provider abstraction, AI insight persistence, copilot, resume analysis,
  recruiter generation, applicant ranking, and hiring insights.
- Socket.IO real-time delivery.
- Component tests and end-to-end tests.
- Staging-specific deployment configuration.

## Broken or risky

- `frontend/.env` previously contained two comma-separated API URLs. It has been
  corrected, and runtime validation now rejects that configuration.
- Email reset depends on valid SMTP configuration and `CLIENT_URL`.
- Rate limiting uses process memory and must use a shared store before horizontal
  scaling.
- JWTs are stored in localStorage. A production hardening phase should consider
  short-lived access tokens plus secure, rotating HTTP-only refresh cookies.
- Upload URL fields can reference external resources; managed storage is safer.
- Browser `prompt`/`confirm` remains in a few admin/destructive workflows.
- Historical legacy comments remain in `backend/server.js`.

## Duplicate/dead/unused candidates

- `frontend/src/components/Logo.css` is no longer imported.
- Redux and React Redux are installed but no active store is present.
- Google OAuth dependency remains installed while the UI is intentionally hidden.
- React Copy to Clipboard and some social packages should be rechecked for usage.
- The commented pre-refactor server implementation in `backend/server.js` is dead.

Do not remove these until a separate cleanup change verifies every import and
deployment script.

## Recommended implementation order

1. Core account lifecycle: email verification, password change, preferences.
2. Application withdrawal, job alerts, search history, and public profiles.
3. Upload service and resume parsing pipeline.
4. Conversations/messages and Socket.IO authorization.
5. Moderation, reports, and historical analytics.
6. Replaceable AI provider and persisted AI insights.
7. TypeScript/design-system migration in bounded route groups.
8. Component and end-to-end tests, then staging/production rollout.
