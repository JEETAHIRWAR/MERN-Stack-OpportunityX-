# OpportunityX API Documentation

## General

**Default local base URL**

```text
http://localhost:8000/api
```

Protected endpoints require:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

Roles:

- `candidate`
- `recruiter`
- `admin`

Legacy users with role `user` are treated as candidates during authentication.

All responses include an `X-Request-Id` header. Rate-limited requests return
HTTP 429 with a human-readable JSON message.

## Health

### GET `/health`

- Auth required: No
- Role: Public
- Purpose: Deployment health check.
- Response: `{ "status": "ok" }`

## Authentication

### POST `/auth/register`

- Auth required: No
- Role: Public
- Public account types: candidate or recruiter

Request:

```json
{
  "username": "Alex Candidate",
  "email": "alex@example.com",
  "password": "minimum8characters",
  "role": "candidate"
}
```

Optional server-controlled admin registration:

```json
{
  "username": "Platform Admin",
  "email": "admin@example.com",
  "password": "minimum8characters",
  "role": "admin",
  "code": "server-configured-code"
}
```

Response summary: JWT and safe user object. Password and reset fields are never returned.

### POST `/auth/login`

- Auth required: No
- Role: Public

Request:

```json
{
  "email": "alex@example.com",
  "password": "minimum8characters"
}
```

Response summary: JWT and safe user object.

### GET `/auth/me`

- Auth required: Yes
- Role: Any authenticated role
- Request body: None
- Response summary: Current safe user object.

### POST `/auth/forgot-password`

- Auth required: No
- Role: Public

Request:

```json
{
  "email": "alex@example.com"
}
```

Response summary: Generic success response regardless of whether the account exists.

### POST `/auth/reset-password`

- Auth required: No
- Role: Public with valid reset token

Request:

```json
{
  "token": "token-from-reset-link",
  "password": "newminimum8characterpassword"
}
```

Response summary: Password reset confirmation.

## Jobs

### GET `/jobs`

- Auth required: No
- Role: Public
- Query parameters:
  - `search`
  - `location`
  - `category`
  - `experience`
  - `jobType`
  - `page` (default 1)
  - `limit` (default 12, maximum 50)
- Response summary:

```json
{
  "jobs": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "pages": 0
  }
}
```

### GET `/jobs/managed`

- Auth required: Yes
- Role: recruiter or admin
- Recruiter behavior: Returns only jobs created by that recruiter.
- Admin behavior: Returns all jobs.

### POST `/jobs`

- Auth required: Yes
- Role: recruiter or admin

Request:

```json
{
  "title": "MERN Stack Developer",
  "description": "<p>Role description</p>",
  "company": "Example Company",
  "location": "Bhopal",
  "applyLink": "https://example.com/apply",
  "applicationStartDate": "2026-06-21",
  "applicationEndDate": "2026-07-21",
  "category": "IT",
  "experience": "Fresher",
  "jobType": "Work from Home",
  "skills": ["React", "Node.js"],
  "employmentType": "Full-time",
  "status": "Published"
}
```

Response summary: Newly created job linked to the authenticated creator.

### GET `/jobs/:id`

- Auth required: No
- Role: Public
- Response summary: Job details with creator summary.

### PUT `/jobs/:id`

- Auth required: Yes
- Role: recruiter or admin
- Recruiter restriction: Must own the job.
- Admin restriction: None.
- Request body: Any supported job fields.
- Response summary: Updated job.

### DELETE `/jobs/:id`

- Auth required: Yes
- Role: recruiter or admin
- Recruiter restriction: Must own the job.
- Admin restriction: None.
- Response summary: Deletes the job and related applications/saved-job rows.

### PUT `/jobs/:id/view`

- Auth required: No
- Role: Public
- Request body: None
- Response summary: Atomically increments view count.

## Candidate Profile

### GET `/profile/me`

- Auth required: Yes
- Role: candidate or admin
- Request body: None
- Response summary: Current profile or an empty profile structure.

### PUT `/profile/me`

- Auth required: Yes
- Role: candidate or admin

Request:

```json
{
  "name": "Alex Candidate",
  "phone": "+91 9999999999",
  "location": "Bhopal",
  "skills": ["React", "Node.js", "MongoDB"],
  "education": "B.Tech in Computer Science",
  "experience": "Built multiple MERN applications",
  "resumeUrl": "https://example.com/resume.pdf",
  "bio": "Full-stack developer focused on web products."
}
```

`skills` may also be sent as a comma-separated string.

Response summary: Created or updated profile.

## Saved Jobs

### GET `/saved-jobs`

- Auth required: Yes
- Role: candidate or admin
- Response summary: Populated saved jobs.

### GET `/saved-jobs/:jobId`

- Auth required: Yes
- Role: candidate or admin
- Response summary: `{ "saved": true | false }`

### POST `/saved-jobs/:jobId`

- Auth required: Yes
- Role: candidate or admin
- Request body: None
- Response summary: Saves the job idempotently.

### DELETE `/saved-jobs/:jobId`

- Auth required: Yes
- Role: candidate or admin
- Request body: None
- Response summary: Removes the saved job.

## Applications

### POST `/applications`

- Auth required: Yes
- Role: candidate

Request:

```json
{
  "jobId": "MongoDBJobId"
}
```

Response summary: Creates an application using the authenticated user's ID, email, and profile/username. Duplicate job applications return HTTP 409.

### GET `/applications/mine`

- Auth required: Yes
- Role: candidate or admin
- Response summary: Applications belonging to the authenticated account, with job summaries.

### GET `/applications/check/:jobId`

- Auth required: Yes
- Role: candidate
- Response:

```json
{
  "hasApplied": true,
  "status": "Reviewing"
}
```

### GET `/applications/job/:jobId`

- Auth required: Yes
- Role: recruiter or admin
- Recruiter restriction: Must own the job.
- Response summary: Applicants for the selected job.

### GET `/applications/:id`

- Auth required: Yes
- Role:
  - Candidate who owns the application
  - Recruiter who owns the application job
  - Admin
- Response summary: Application detail.

### PATCH `/applications/:id`

- Auth required: Yes
- Role: recruiter or admin
- Recruiter restriction: Must own the application job.

Request:

```json
{
  "status": "Shortlisted",
  "recruiterNotes": "Strong React experience; schedule technical interview."
}
```

Allowed statuses:

- Applied
- Reviewing
- Shortlisted
- Interview
- Rejected
- Hired

Response summary: Updated application and candidate notification when status changes.

## Recruiter

### GET `/recruiter/dashboard`

- Auth required: Yes
- Role: recruiter or admin
- Response summary:
  - Owned job count
  - Applications across owned jobs
  - Status breakdown

### GET `/recruiter/company`

- Auth required: Yes
- Role: recruiter or admin
- Response summary: Company profile owned by the authenticated user.

### PUT `/recruiter/company`

- Auth required: Yes
- Role: recruiter or admin

Request:

```json
{
  "name": "Example Company",
  "website": "https://example.com",
  "location": "Bhopal",
  "description": "Product engineering company",
  "logoUrl": "https://example.com/logo.png"
}
```

Response summary: Created or updated company profile.

Additional required verification fields include recruiter name, official
company email, phone, company size, industry, designation, and either website
or LinkedIn URL.

### POST `/recruiter/company/submit`

- Auth required: Yes
- Role: recruiter or admin
- Purpose: Validates profile completeness and moves verification status to
  `pending`.
- Response summary: Updated company verification record.

Recruiter verification states:

- `unverified`
- `pending`
- `verified`
- `rejected`

Only verified recruiters can publish or promote jobs beyond Draft status.

## Admin

### GET `/admin/dashboard`

- Auth required: Yes
- Role: admin
- Response summary:
  - Total users
  - Candidates
  - Recruiters
  - Jobs
  - Applications

### GET `/admin/users`

- Auth required: Yes
- Role: admin
- Response summary: Safe user list without credentials or reset data.

### GET `/admin/applications`

- Auth required: Yes
- Role: admin
- Response summary: All applications with job and applicant summaries.

### GET `/admin/recruiters`

- Auth required: Yes
- Role: admin
- Optional query: `status`
- Response summary: Recruiter/company verification records.

### PATCH `/admin/recruiters/:id/review`

- Auth required: Yes
- Role: admin

```json
{
  "status": "verified",
  "notes": "Official company details reviewed."
}
```

### PATCH `/admin/users/:id`

- Auth required: Yes
- Role: admin

```json
{
  "role": "recruiter",
  "accountStatus": "active"
}
```

Supports role changes and account suspension/reactivation.

## Candidate Dashboard

### GET `/profile/dashboard`

- Auth required: Yes
- Role: candidate or admin
- Response summary: Saved-job count, recent applications, profile completion,
  and profile-based recommended jobs.

## Notifications

### GET `/notifications`

- Auth required: Yes
- Role: Any authenticated role
- Response summary: Up to 50 newest notifications for the current user.

### PATCH `/notifications/:id/read`

- Auth required: Yes
- Role: Notification owner
- Request body: None
- Response summary: Marks the notification as read.

## Common Error Responses

```json
{
  "message": "Human-readable error message"
}
```

Common status codes:

- `400` invalid input or ObjectId
- `401` missing, invalid, or expired authentication
- `403` authenticated but not authorized
- `404` resource not found
- `409` duplicate email/application
- `500` unexpected server error
# UI Upgrade API Notes — 2026-06-21

The product redesign reuses the existing production APIs. No mock API or static
dashboard data was introduced.

| Method | Endpoint | Authentication | Role | Purpose |
| --- | --- | --- | --- | --- |
| GET | `/api/recruiter/dashboard` | Required | Recruiter/Admin | Returns API-derived job, applicant, and status totals. |
| GET | `/api/recruiter/company` | Required | Recruiter/Admin | Returns the current recruiter's company and verification metadata. |
| PUT | `/api/recruiter/company` | Required | Recruiter/Admin | Saves supported company and recruiter profile fields. |
| POST | `/api/recruiter/company/submit` | Required | Recruiter/Admin | Validates required profile fields and changes verification status to `pending`. |
| POST | `/api/jobs` | Required | Verified recruiter/Admin | Creates a job. Drafts may be saved by an unverified recruiter; publishing requires verification. |
| PATCH | `/api/admin/recruiters/:id/review` | Required | Admin | Approves or rejects a recruiter and records review notes. |

The frontend route `/recruiter/company` is a client route and does not replace
any API endpoint.

## Screenshot Features Requiring APIs

| Proposed endpoint | Purpose |
| --- | --- |
| `POST /api/auth/verify-email` | Verify registration OTP/email ownership. |
| `GET/POST /api/conversations` | List and create authorized conversations. |
| `GET/POST /api/messages` | Read and send recruiter-candidate messages. |
| `GET/POST /api/job-alerts` | Persist candidate search alerts. |
| `GET /api/recommendations/jobs` | Return explainable candidate job recommendations. |
| `POST /api/uploads/resume` | Validate and store resume files. |
| `POST /api/uploads/company-logo` | Validate and store company logos. |
| `GET /api/profiles/:username` | Serve a public candidate portfolio profile. |
| `PATCH /api/auth/password` | Change password after current-password verification. |
| `PATCH /api/preferences` | Store appearance and notification preferences. |
| `GET /api/recruiter/analytics` | Return historical recruiter time-series metrics. |
| `GET /api/admin/analytics` | Return historical platform metrics. |
| `PATCH /api/admin/jobs/:id/moderation` | Approve, flag, or reject a job with audit metadata. |

## Newly implemented platform APIs

| Method | Endpoint | Role | Summary |
| --- | --- | --- | --- |
| POST | `/api/auth/verify-email` | Public | Verify a six-digit email code. |
| POST | `/api/auth/resend-verification` | Public | Issue a replacement verification code. |
| PATCH | `/api/auth/password` | Authenticated | Change password after current-password verification. |
| GET/PATCH | `/api/preferences` | Authenticated | Read/update appearance and notification preferences. |
| GET/POST | `/api/job-alerts` | Candidate | List/create persisted search alerts. |
| PATCH/DELETE | `/api/job-alerts/:id` | Candidate owner | Update/delete an alert. |
| PATCH | `/api/applications/:id/withdraw` | Candidate owner | Withdraw an active application. |
| GET | `/api/profile/public/:username` | Public | Read a candidate public profile. |
| GET/POST | `/api/conversations` | Application participant | List/start conversations. |
| GET/POST | `/api/conversations/:id/messages` | Conversation participant | Read/send messages. |
| PATCH | `/api/notifications/read-all` | Authenticated | Mark all notifications read. |
| POST | `/api/uploads/resume` | Candidate | Upload resume to managed storage. |
| POST | `/api/uploads/company-logo` | Recruiter/Admin | Upload company logo. |
| GET | `/api/recruiter/analytics` | Recruiter/Admin | Job views, applications, conversion. |
| GET | `/api/admin/analytics` | Admin | Six-month platform series and popular skills. |
| GET | `/api/admin/reports/summary` | Admin | Current role/job/application/verification report. |
| PATCH | `/api/admin/jobs/:id/moderation` | Admin | Approve, flag, or reject a job. |
| POST | `/api/ai/candidate/copilot` | Candidate | Career copilot response. |
| POST | `/api/ai/resume/analyze` | Candidate | Persisted structured resume analysis. |
| POST | `/api/ai/recommendations/jobs` | Candidate | Explainable AI job ranking. |
| POST | `/api/ai/recruiter/copilot` | Recruiter/Admin | Recruiting content assistance. |
