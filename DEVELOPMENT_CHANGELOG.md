# OpportunityX Development Changelog

## Production Readiness and Enterprise Hiring Phase

Implemented after the initial role-based portal upgrade:

- Safe legacy migration runner with dry-run and execute modes.
- Ambiguous/unmatched email reporting with no automatic guessing.
- Isolated in-memory MongoDB integration suite.
- Endpoint-specific rate limits for authentication, password reset,
  applications, and view counts.
- Helmet CSP, exact-origin CORS, request IDs, JSON request logging,
  centralized errors, and `sanitize-html` rich-text allowlisting.
- Recruiter onboarding and verification workflow:
  `unverified`, `pending`, `verified`, and `rejected`.
- Verified-recruiter publishing enforcement with Draft support.
- Expanded recruiter/company profile and admin approval/rejection.
- Job lifecycle: Draft, Published, Paused, Closed.
- Job skills and employment type.
- Candidate dashboard with profile completion and recommendations.
- Admin recruiter review, role management, suspension/reactivation, and
  applications-per-job metric.
- Paginated public job queries.
- New text-first OpportunityX brand mark, verification badge, and enterprise
  footer/navigation updates.
- Removed unused legacy compatibility files after import verification.
- Added `DEPLOYMENT.md`.
- Removed dormant Google OAuth, Cloudinary, Multer, Axios, and Babel backend
  packages/configuration that were not part of active application flows.
- Upgraded Nodemailer to the patched major release.
- Production dependency audit now reports zero vulnerabilities.

### New production files

- `backend/scripts/migrateLegacyData.js`
- `backend/tests/setup.js`
- `backend/tests/api.integration.test.js`
- `backend/tests/migration.integration.test.js`
- `backend/jest.config.js`
- `backend/middlewares/rateLimiters.js`
- `backend/middlewares/requestLogger.js`
- `backend/middlewares/errorMiddleware.js`
- `backend/utils/asyncHandler.js`
- `backend/utils/sanitizeRichText.js`
- `frontend/src/pages/CandidateDashboard.jsx`
- `frontend/src/pages/AdminRecruiters.jsx`
- `DEPLOYMENT.md`

### New environment variables

- `CORS_ORIGINS`
- `TRUST_PROXY_HOPS`
- `MIGRATION_MONGODB_URI`
- `LEGACY_JOB_OWNER_ID`
- All `RATE_LIMIT_*` variables documented in `backend/.env.sample`

### Verification commands

```bash
cd backend
npm test
npm run migrate:legacy

cd ../frontend
npm run lint
npm run build
```

## Upgrade Summary

This upgrade moves OpportunityX from an administrator-managed job board toward a role-based job portal with real candidate, recruiter, and admin workflows.

The work was based on `OPPORTUNITYX_DEVELOPMENT_ANALYSIS_REPORT.md` and focused first on server-side security, then database relationships, protected APIs, frontend role flows, UI quality, cleanup, and documentation.

## Security and Authentication Changes

- Added server-side role authorization middleware.
- Fixed the missing Authorization header crash in the authentication middleware.
- Added a protected `GET /api/auth/me` endpoint for session validation.
- Authentication responses now return an explicit safe user object and never return:
  - Password hashes
  - Password-reset tokens
  - Password-reset expiration values
- Changed password fields and reset-token fields to non-selectable Mongoose fields.
- Added password length validation.
- Normalized emails with lowercase and trim rules.
- Added backward-compatible handling for legacy `user` roles by treating them as `candidate`.
- Removed frontend admin-code validation and removed admin signup from the public registration UI.
- Kept optional server-only admin registration support through `ADMIN_REGISTRATION_CODE`.
- Hashed password-reset tokens before database storage.
- Changed forgot-password responses to avoid revealing whether an email is registered.
- Added server-side ownership checks for recruiter jobs and applications.
- Added ObjectId validation middleware before protected database queries.
- Added URL protocol validation for external apply links.
- Added basic rich-text sanitization for job descriptions.
- Improved CORS origin handling.
- Added an API health endpoint.
- Temporarily hid Google login until secure provider-side account linking is implemented.

## Database Changes

### User

- Added roles: `candidate`, `recruiter`, and `admin`.
- Added timestamps.
- Added email and role indexes.
- Made sensitive fields non-selectable.

### Job

- Added `createdBy` reference to User.
- Added timestamps.
- Converted application dates to Date fields.
- Added category, experience, job type, creator, creation-date, and text indexes.
- Recruiters can manage only jobs they created.
- Admins can manage all jobs.

### Application

- Added authenticated `applicant` reference.
- Added status values:
  - Applied
  - Reviewing
  - Shortlisted
  - Interview
  - Rejected
  - Hired
- Added recruiter notes.
- Added timestamps.
- Added a partial unique index on job and applicant to prevent duplicate new applications while allowing legacy records without applicant IDs to remain during migration.

### New models

- `Profile`
- `Company`
- `SavedJob`
- `Notification`

All new models include timestamps, references, validation limits, and useful indexes.

## Backend Feature Changes

### Candidate

- Get and update candidate profile.
- Save a job.
- Remove a saved job.
- View saved jobs.
- View personal applications.
- Apply using authenticated user identity.
- Check personal application state.

### Recruiter

- View recruiter dashboard totals.
- Create jobs.
- View and manage owned jobs.
- Edit owned jobs.
- Delete owned jobs.
- View applicants for owned jobs.
- Update application status.
- Add recruiter notes.
- Get and update company profile.

### Admin

- View platform dashboard totals.
- View all users.
- View all jobs through the managed-jobs endpoint.
- Create, edit, and delete any job.
- View all applications.
- View applicants for any job.
- Update any application status or recruiter notes.

### General

- Added notifications when an application status changes.
- Added cascading cleanup of applications and saved-job records when a job is deleted.
- Made view-count updates atomic.
- Added server-side job search and filters.
- Fixed the application controller double-response bug.
- Fixed the incorrect combined frontend build path.
- Added an API 404 response before SPA fallback handling.

## Frontend Changes

- Moved the API origin to `VITE_API_BASE_URL`.
- Added backend session validation on application startup.
- Added centralized expired-session cleanup for HTTP 401 responses.
- Removed the duplicate AuthProvider.
- Replaced the artificial three-second startup delay.
- Added candidate, recruiter, and admin route guards.
- Added a responsive role-aware navigation bar.
- Added shared recruiter/admin workspace layout.
- Rebuilt login and registration pages with:
  - Clearer layout
  - Disabled submit states
  - Toast feedback
  - Candidate/recruiter selection
  - Password visibility
- Rebuilt the home page with modern job cards and server-backed filters.
- Rebuilt job details with:
  - Save/unsave
  - Apply state
  - Share support
  - Loading and error states
- Added candidate profile editing.
- Added saved jobs.
- Added personal application tracking.
- Added recruiter dashboard and company profile.
- Added recruiter/admin job creation and editing.
- Added applicant management.
- Added admin overview, user list, and application list.
- Fixed the former ManageJobs undefined `setError` path by replacing it with maintained error handling.
- Replaced placeholder Edit and Save actions with real API-backed functionality.

## Files Added

### Backend

- `backend/middlewares/validateObjectId.js`
- `backend/models/Profile.js`
- `backend/models/Company.js`
- `backend/models/SavedJob.js`
- `backend/models/Notification.js`
- `backend/controllers/profileController.js`
- `backend/controllers/savedJobController.js`
- `backend/controllers/recruiterController.js`
- `backend/controllers/adminController.js`
- `backend/controllers/notificationController.js`
- `backend/routes/profileRoutes.js`
- `backend/routes/savedJobRoutes.js`
- `backend/routes/recruiterRoutes.js`
- `backend/routes/adminRoutes.js`
- `backend/routes/notificationRoutes.js`

### Frontend

- `frontend/.env.example`
- `frontend/src/components/AuthLogin.jsx`
- `frontend/src/components/AuthRegister.jsx`
- `frontend/src/components/ModernNavbar.jsx`
- `frontend/src/components/PortalLayout.jsx`
- `frontend/src/pages/ModernHome.jsx`
- `frontend/src/pages/ModernJobDetails.jsx`
- `frontend/src/pages/CandidateProfile.jsx`
- `frontend/src/pages/SavedJobs.jsx`
- `frontend/src/pages/MyApplications.jsx`
- `frontend/src/pages/RecruiterDashboard.jsx`
- `frontend/src/pages/ModernManageJobs.jsx`
- `frontend/src/pages/JobForm.jsx`
- `frontend/src/pages/ManageApplicants.jsx`
- `frontend/src/pages/AdminOverview.jsx`
- `frontend/src/pages/AdminUsers.jsx`
- `frontend/src/pages/AdminApplications.jsx`

### Documentation

- `DEVELOPMENT_CHANGELOG.md`
- `API_DOCUMENTATION.md`
- `NEXT_STEPS.md`

## Existing Files Modified

### Backend

- `backend/.env.sample`
- `backend/app.js`
- `backend/models/User.js`
- `backend/models/Job.js`
- `backend/models/Application.js`
- `backend/middlewares/authMiddleware.js`
- `backend/controllers/authController.js`
- `backend/controllers/jobController.js`
- `backend/controllers/applicationController.js`
- `backend/routes/authRoutes.js`
- `backend/routes/jobRoutes.js`
- `backend/routes/applicationRoutes.js`
- `backend/utils/sendEmail.js`

### Frontend

- `frontend/.eslintrc.cjs`
- `frontend/vite.config.js`
- `frontend/src/main.jsx`
- `frontend/src/App.jsx`
- `frontend/src/auth/auth.jsx`
- `frontend/src/utils/api.js`
- `frontend/src/components/PrivateRoute.jsx`
- `frontend/src/components/ForgotPassword.jsx`
- `frontend/src/components/ResetPassword.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/LoadingDots.jsx`
- `frontend/src/components/Logo.jsx`
- `frontend/src/components/PageNotFound.jsx`
- `frontend/src/pages/About.jsx`
- Legacy component/page entry points were retained only for import compatibility while active routes use their maintained replacements.

## Verification Completed

- Frontend ESLint: passed.
- Frontend production build: passed.
- Backend JavaScript syntax check: passed for 33 files.
- Express `/api/health` Supertest smoke test: passed.

## Remaining Issues

- Existing database records still need an explicit migration for:
  - User role `user` to `candidate`
  - Job `createdBy`
  - Application `applicant`, status, and timestamps
- Google OAuth remains intentionally disabled.
- Resume handling currently stores a URL; direct file upload is not implemented.
- Rate limiting and full production security headers should be added before public launch.
- The old compatibility entry-point files should be physically removed in a future cleanup after confirming no external imports depend on them.
- Full integration tests require an isolated test database.
