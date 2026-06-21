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
