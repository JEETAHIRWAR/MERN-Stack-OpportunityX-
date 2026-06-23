# OpportunityX Screenshot Feature Matrix

## Public and Authentication

- Sticky OpportunityX navigation with public and authenticated states.
- Landing hero, keyword/location search, job type and experience filters.
- Job counts, cards, empty states, workflow section, and registration CTA.
- Split-screen sign-in and registration forms.
- Email verification/OTP screen: backend required (`POST /api/auth/verify-email`).

## Candidate

- Dashboard metrics, profile completion, recommended jobs, saved jobs, and applications.
- Candidate profile fields and resume URL.
- Application pipeline statuses.
- Notifications: implemented using `/api/notifications`.
- Job alerts: backend required (`/api/job-alerts`).
- AI recommendations: backend required (`/api/recommendations/jobs`).
- Messaging: backend required (`/api/conversations`, `/api/messages`).
- Resume binary upload/parsing: backend required (`/api/uploads/resume`).
- Public portfolio profile: backend required (`GET /api/profiles/:username`).
- Settings/preferences: backend required (`PATCH /api/preferences`).

## Recruiter

- Dashboard with API-derived job and applicant metrics.
- Company profile and verification workflow.
- Job creation, draft/published states, editing, deletion, and applicant access.
- Applicant search, status filters, recruiter notes, and status updates.
- Notifications: implemented using `/api/notifications`.
- Analytics snapshot: implemented from `/api/recruiter/dashboard`.
- Historical analytics: backend required (`GET /api/recruiter/analytics`).
- Messaging and attachments: backend required.
- Password/preferences/settings: backend required.

## Admin

- API-derived platform dashboard.
- User roles, suspension, and reactivation.
- Recruiter approval/rejection with review notes.
- Job and application management.
- Analytics snapshot: implemented from `/api/admin/dashboard`.
- Historical analytics: backend required (`GET /api/admin/analytics`).
- Job approve/flag/reject moderation states: backend required
  (`PATCH /api/admin/jobs/:id/moderation`).
- Platform settings and notification preferences: backend required.

## Features intentionally not faked

No static chat messages, revenue, monthly growth series, AI match percentages,
profile views, testimonials, OTP codes, upload success, or moderation outcomes
are presented as real data.
