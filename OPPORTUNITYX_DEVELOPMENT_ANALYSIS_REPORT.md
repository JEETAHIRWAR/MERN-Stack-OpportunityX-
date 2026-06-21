# OpportunityX Development Analysis Report

**Project:** OpportunityX  
**Architecture:** MERN stack job portal  
**Analysis scope:** Complete repository as available in the project workspace  
**Analysis date:** June 21, 2026  
**Method:** Static codebase review only; no project source code was modified

---

## Executive Summary

OpportunityX is a working MERN-based job listing portal with public job browsing, client-side search and filtering, local email/password authentication, password recovery, an admin job-publishing dashboard, external job application redirection, and basic application tracking.

The current implementation is best described as a **public job board managed by administrators**, rather than a complete candidate–recruiter–admin platform. The code does not contain a recruiter role, recruiter-owned jobs, candidate profile data, saved-job persistence, notifications, resume handling, or full application lifecycle management.

The project demonstrates practical full-stack development skills, including React routing and component design, Express REST APIs, MongoDB modeling, JWT authentication, bcrypt password hashing, email-based password reset, rich-text job descriptions, and responsive Tailwind CSS layouts. However, important authorization, privacy, validation, OAuth, and deployment issues must be fixed before the application is production-ready.

### Current implementation status

| Area | Status | Summary |
|---|---|---|
| Public job browsing | Implemented | Users can view job cards and job details. |
| Search and filtering | Implemented | Client-side search and five filter inputs are available. |
| Candidate registration/login | Implemented | Local email/password authentication exists. |
| Password recovery | Implemented, configuration-dependent | Reset tokens and email delivery are implemented. |
| Google login | Broken / incomplete | Frontend and backend integration contains multiple route, provider, export, and schema problems. |
| Candidate application tracking | Partially implemented | Records name, email, and job ID, then opens an external application link. |
| Admin job creation/deletion | Implemented with authorization risk | UI is admin-only, but backend mutations allow any authenticated user. |
| Job editing | Backend only / UI not implemented | `PUT /api/jobs/:id` exists, but the Edit button displays an alert. |
| Recruiter workflows | Not implemented | No recruiter role, dashboard, company, ownership, or recruiter APIs exist. |
| Profile management | Not implemented | The profile page explicitly says it is under development. |
| Saved jobs | Not implemented | A Save button exists without a click handler or database model. |
| Notifications | Not implemented | No model, route, controller, or UI exists. |
| Admin platform management | Partially implemented | Admins can manage jobs only; there is no user, recruiter, application, or analytics management. |

---

# 1. Project Overview

## 1.1 What the project does

OpportunityX provides a web interface where visitors can:

- Browse published jobs.
- Search by job title, company, location, or job type.
- Filter jobs by location, category, posting date, experience level, and work arrangement.
- Open a detailed job page.
- Register or log in.
- Record an application and continue to an external application URL.
- Share job links through social platforms or copy the URL.
- Request and complete a password reset.

Administrators can:

- Register using an admin registration code.
- Access an admin-only frontend dashboard.
- Add new jobs.
- View all jobs.
- Delete jobs.

An update endpoint exists in the backend, but the frontend job-editing workflow is not implemented.

## 1.2 Target users

### Candidates / job seekers

This is the primary implemented user group. The database calls this role `user`, not `candidate`. Candidates can browse jobs, authenticate, record an application, and access a placeholder profile page.

### Administrators

Administrators publish and remove jobs through the dashboard. The intended admin role is implemented in the frontend, but backend role enforcement is missing.

### Recruiters

**Not implemented.** There is no `recruiter` role in the User model, no recruiter dashboard, no recruiter registration, no company profile, and no relationship between a job and the person or organization that posted it.

## 1.3 Main business purpose

The application is intended to bridge job seekers and available opportunities. In its current form, its practical business purpose is to let a central platform administrator curate job listings and redirect interested users to external application pages while recording basic application interest.

It is not yet a complete hiring marketplace because employers cannot independently manage their own jobs or applicants, and candidates do not have resumes, detailed profiles, saved jobs, or application status tracking.

---

# 2. Tech Stack Analysis

## 2.1 Frontend technologies

| Technology | Usage |
|---|---|
| React 18 | Component-based frontend UI. |
| Vite 5 | Development server and production bundler. |
| React Router DOM 6 | Public, protected, nested, and fallback page routing. |
| Axios | Main API client and authorization-header interceptor. |
| React Context | Authentication state through `AuthProvider`. |
| React.lazy and Suspense | Page-level lazy loading. |
| React Quill / Quill | Rich-text job description editing and display. |
| React Toastify | Success and error notifications in forms. |
| React Icons | UI icons. |
| React Share | Job sharing buttons. |
| React Copy to Clipboard | Copies job links. |
| Google OAuth React package | Intended Google OAuth authorization-code flow; currently broken. |

`redux` and `react-redux` are installed but are not used. `@tinymce/tinymce-react` is also installed but not used.

## 2.2 Backend technologies

| Technology | Usage |
|---|---|
| Node.js with ES modules | Backend runtime and module system. |
| Express 4 | REST API routing and middleware. |
| Mongoose 8 | MongoDB schemas, models, and queries. |
| bcryptjs | Password hashing and comparison. |
| jsonwebtoken | JWT creation and verification. |
| dotenv | Environment configuration. |
| cors | Cross-origin request configuration. |
| Nodemailer | Password-reset email delivery. |
| Google APIs and Axios | Intended Google OAuth token exchange and profile retrieval. |
| Nodemon | Backend development reload. |

Helmet, Jest, Supertest, Babel, Cloudinary, and Multer-related packages are installed, but they are not integrated into the active server flow.

## 2.3 Database

The project uses MongoDB through Mongoose. The configured database name is:

```text
JobPortal
```

The active models are:

- User
- Job
- Application

There are no Profile, SavedJob, Notification, Company, Recruiter, Resume, Interview, or Message models.

## 2.4 Authentication

Authentication uses:

- Email and password registration.
- bcrypt password hashing through a Mongoose pre-save hook.
- JWT access tokens.
- Bearer tokens in the `Authorization` header.
- Browser `localStorage` for token and user persistence.
- A custom frontend `PrivateRoute` for role-aware navigation.
- Email-based password reset tokens.
- An intended Google OAuth flow that is not currently functional.

## 2.5 Styling

The main styling system is Tailwind CSS 3 with PostCSS and Autoprefixer. Small dedicated CSS files are used for:

- Logo styling.
- Loading animation.
- React Quill presentation.

The UI includes responsive layouts for the navigation bar, job grid, filters, forms, job details, and admin dashboard.

## 2.6 Deployment-related tools

- Vite provides the frontend production build through `npm run build`.
- Express starts through `node server.js`.
- The frontend API client is hardcoded to a Render URL: `https://opportunityx.onrender.com/api`.
- MongoDB Atlas is implied by the sample `mongodb+srv` connection string.
- Environment variables support deployment configuration.
- No `render.yaml`, `vercel.json`, `netlify.toml`, Dockerfile, CI workflow, or root-level deployment script was found.

---

# 3. Folder Structure Analysis

## 3.1 High-level structure

```text
OpportunityX/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── src/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.sample
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── auth/
    │   ├── components/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 3.2 Frontend folder structure

### `frontend/src/main.jsx`

Creates the React root, imports global Tailwind styles, wraps the app in an `AuthProvider`, and renders `App`.

### `frontend/src/App.jsx`

Defines:

- Browser routing.
- Lazy-loaded pages.
- Public and protected routes.
- Navigation and footer layout.
- Toast container.
- A fixed three-second application loading screen.
- Global home-page error behavior.

It wraps the app in a second `AuthProvider`, which makes the provider in `main.jsx` redundant.

### `frontend/src/auth/auth.jsx`

Implements the authentication context:

- Restores `token` and `user` from `localStorage`.
- Stores user data after login.
- Removes data during logout.

It does not validate the stored token with the backend or automatically handle token expiration.

### `frontend/src/utils/api.js`

Creates the main Axios instance. It:

- Uses a hardcoded production API URL.
- Adds the JWT bearer token to outgoing requests.
- Implements a retry interceptor for HTTP 400 responses.

The retry logic is semantically incorrect because 400 means a client error, not “Too Many Requests”; rate limiting should normally use 429.

### `frontend/src/api/`

Contains `auth.js` and `job.js`, but these are placeholder/simulated fetch wrappers and are not used by the active pages. Some endpoints in `auth.js` do not match the real backend.

### `frontend/src/components/`

Important components include:

- `Navbar.jsx`: responsive navigation and authenticated-user menu.
- `Footer.jsx`: company, contact, social, and quick links.
- `Login.jsx`: login form with client-side CAPTCHA.
- `Register.jsx`: user/admin registration form.
- `GoogleLogin.jsx`: intended OAuth authorization-code login.
- `ForgotPassword.jsx`: reset-link request form.
- `ResetPassword.jsx`: new-password form.
- `PrivateRoute.jsx`: frontend authentication and role guard.
- `PageNotFound.jsx`: fallback page.
- `LoadingDots.jsx`: loading indicator.
- `Logo.jsx`: reusable text logo.

### `frontend/src/pages/`

- `Home.jsx`: job retrieval, search, filters, and cards.
- `JobDetails.jsx`: job details, sharing, application tracking, external apply redirect, and view increment.
- `AdminDashboard.jsx`: nested admin layout and navigation.
- `ManageJobs.jsx`: job list and delete action.
- `AddJob.jsx`: rich-text job creation form.
- `UserProfile.jsx`: placeholder profile page.
- `About.jsx`: static company and service information.

### `frontend/public/`

Contains logo/illustration and error/maintenance images.

## 3.3 Backend folder structure

### `backend/server.js`

Connects to MongoDB and starts the Express server on `PORT` or port 5000.

### `backend/app.js`

Configures:

- JSON request parsing.
- CORS.
- Authentication routes.
- Job routes.
- Application routes.
- Static frontend serving and a catch-all SPA route.

The configured static frontend path is incorrect for the repository’s sibling-folder structure.

### `backend/config/`

- `db.js`: creates the MongoDB connection and appends the `JobPortal` database name.
- `cloudinary.js`: unused Cloudinary configuration written in CommonJS.
- `multer.js`: unused Cloudinary-backed Multer upload configuration written in CommonJS.

Because the backend package uses `"type": "module"`, the CommonJS `require` and `module.exports` files are incompatible if imported without conversion.

### `backend/models/`

Contains the active User, Job, and Application Mongoose schemas.

### `backend/controllers/`

Contains business logic for:

- Registration, login, password reset, and Google OAuth.
- Job CRUD and view counts.
- Application creation, retrieval, and duplicate checking.

### `backend/routes/`

Maps REST endpoints to controller functions. Only job creation, update, and deletion use authentication middleware.

### `backend/middlewares/authMiddleware.js`

Reads a bearer token, verifies the JWT, fetches the user, and attaches it to `req.user`.

### `backend/utils/`

- `sendEmail.js`: Nodemailer email helper.
- `googleConfig.js`: Google OAuth2 client creation.

### `backend/src/constants.js`

Exports the fixed MongoDB database name.

---

# 4. Feature Analysis

## 4.1 Candidate features

### Implemented

- Public job browsing.
- Job detail viewing.
- Search and filtering.
- Local registration and login.
- Password reset request and completion.
- Basic apply action for authenticated users.
- Duplicate application check by `jobId + email`.
- Job sharing and link copying.
- Basic logged-in profile route.

### Partially implemented

- Application submission only stores `jobId`, `name`, and `email`; it then sends the user to an external URL.
- Application history is not shown to candidates.
- Application status is only a boolean “already applied” check.
- The candidate role is represented by the generic role name `user`.

### Not implemented

- Candidate profile editing.
- Skills, education, experience, bio, location, or contact profile fields.
- Resume upload or resume management.
- Internal application form.
- Application status stages.
- Saved jobs.
- Candidate notifications.
- Job recommendations.

## 4.2 Recruiter features

**Not implemented.**

There is no:

- Recruiter role.
- Recruiter signup or approval.
- Recruiter dashboard.
- Company profile.
- Job ownership.
- Recruiter-specific job management.
- Applicant review.
- Application status update.
- Candidate search.
- Recruiter analytics.

The current admin is the only job publisher.

## 4.3 Admin features

### Implemented

- Admin registration using a code.
- Frontend admin route guard.
- Admin dashboard shell.
- Add-job form.
- Job list.
- Delete-job action.

### Partially implemented

- A backend update endpoint exists, but the frontend Edit button explicitly states that editing is not implemented.
- Job management applies to all jobs because jobs have no creator/owner.

### Not implemented

- User management.
- Recruiter management.
- Application management.
- Platform moderation.
- Admin analytics.
- Role assignment.
- Account suspension.
- Audit logs.

## 4.4 Authentication features

### Implemented

- Email/password registration.
- Email/password login.
- bcrypt password hashing.
- JWT generation.
- JWT verification middleware.
- Frontend protected routes.
- Logout by clearing local storage.
- Password-reset email flow.

### Broken or incomplete

- Google login is not functional.
- No current-user endpoint validates restored sessions.
- No refresh-token flow exists despite refresh-token environment variables.
- No email verification.
- No server-side CAPTCHA.
- No rate limiting.

## 4.5 Job search and filtering

Implemented on the client side after fetching the entire jobs collection.

Filters include:

- Free-text search across title, company, location, and job type.
- Location text.
- Category: IT or Non-IT.
- Posting age.
- Experience: Fresher or Experienced.
- Work arrangement: Work from Home or In Office.

Limitations:

- Filtering is not server-side.
- There is no pagination, sorting, result count, salary filter, keyword indexing, or full-text database search.
- Filter dropdown changes do not apply until the button is clicked, while text search applies immediately.
- All jobs are fetched regardless of data size.

## 4.6 Application management

### Implemented

- Creates an application record.
- Prevents an obvious duplicate by querying `jobId` and email.
- Checks whether an email has already applied.
- Retrieves applications by job ID.
- Retrieves an application by ID.

### Partially implemented / insecure

- Application endpoints are not protected.
- Applications are not linked to a User document.
- Any client can submit any name/email combination directly to the API.
- Any client can query application records and application status.
- There is no recruiter/admin UI to review applications.
- There is no application status field.
- There is no database-level unique compound index.

## 4.7 Saved jobs

**Not implemented.**

The job details page displays a Save button, but it has no click handler. There is no SavedJob model, route, controller, or frontend state.

## 4.8 Notifications

**Not implemented.**

Toast messages provide temporary UI feedback, but they are not persistent user notifications. There is no Notification model, API, notification page, email notification system beyond password reset, or real-time delivery.

## 4.9 Profile management

**Not implemented.**

The protected `/profile` route displays the logged-in username and a maintenance image. The page explicitly says “Profile page is under development.” There is no Profile model or profile API.

---

# 5. Backend API Analysis

## 5.1 Authentication routes

Base path: `/api/auth`

| Method | Endpoint | Purpose | Authentication | Role access |
|---|---|---|---|---|
| POST | `/api/auth/register` | Create a user or admin and return a JWT. | Public | User; admin requires registration code. |
| POST | `/api/auth/login` | Validate credentials and return a JWT. | Public | Any stored role. |
| GET | `/api/auth/google?code=...` | Exchange Google authorization code and create/find a user. | Public | Intended general user access; currently broken. |
| POST | `/api/auth/forgot-password` | Create reset token and email a reset URL. | Public | Any registered email. |
| POST | `/api/auth/reset-password` | Set a new password using a valid reset token. | Public with reset token | Token owner. |

### POST `/api/auth/register`

**Request body**

```json
{
  "username": "Example User",
  "email": "user@example.com",
  "password": "plaintext password",
  "role": "user",
  "code": "admin-code-if-role-is-admin"
}
```

**Behavior**

- Reads the configured admin code.
- Rejects an admin request when the code does not match.
- Checks for an existing email.
- Creates the user.
- Password is hashed by the User model pre-save hook.
- Returns HTTP 201 with `{ token, user }`.

**Problems**

- No body validation or password policy.
- The allowed role comes directly from the client.
- The admin code check is duplicated.
- The returned `user` includes the stored password hash because it is not excluded.
- The frontend also contains a hardcoded admin code.

### POST `/api/auth/login`

**Request body**

```json
{
  "email": "user@example.com",
  "password": "plaintext password"
}
```

**Behavior**

- Finds a user by email.
- Compares password using bcrypt.
- Returns HTTP 200 with `{ token, user }`.
- Returns HTTP 401 for invalid credentials.

**Problems**

- The returned user includes the password hash and possibly reset-token fields.
- No login rate limiting or account lockout.
- Email normalization is inconsistent.

### GET `/api/auth/google`

**Input**

```text
Query parameter: code
```

**Intended behavior**

- Exchange Google authorization code for tokens.
- Request the Google user profile.
- Find or create a local user.
- Return a local JWT.

**Actual status: broken**

- `googleConfig.js` exports an object containing `oauth2Client`, but the controller calls `getToken` directly on the exported object.
- The User schema requires `password` and `role`, but Google-created users do not supply either field.
- `image` is supplied but does not exist in the schema.
- The frontend calls `/api/google`, not `/api/auth/google`.
- The active frontend component is not inside a rendered `GoogleOAuthProvider`.

### POST `/api/auth/forgot-password`

**Request body**

```json
{
  "email": "user@example.com"
}
```

**Behavior**

- Finds the user.
- Generates a random 20-byte hexadecimal token.
- Stores the raw token and one-hour expiration.
- Sends a reset link using Nodemailer.
- Returns HTTP 200 if email sending succeeds.

**Problems**

- Reveals whether an email exists.
- Stores the reset token in plain form rather than storing a hash.
- No request rate limiting.
- Delivery depends on correct SMTP and `CLIENT_URL` configuration.

### POST `/api/auth/reset-password`

**Request body**

```json
{
  "token": "reset-token",
  "password": "new plaintext password"
}
```

**Behavior**

- Finds a user with the token and a future expiry.
- Reassigns the password.
- The pre-save hook hashes the new password.
- Clears token fields.
- Returns HTTP 200.

**Problems**

- No password-strength validation.
- Existing JWTs are not revoked after a password reset.

## 5.2 Job routes

Base path: `/api/jobs`

| Method | Endpoint | Purpose | Authentication | Role access |
|---|---|---|---|---|
| GET | `/api/jobs` | Return all jobs. | Public | All visitors. |
| POST | `/api/jobs` | Create a job. | Bearer JWT required | Any authenticated user; admin restriction is missing. |
| GET | `/api/jobs/:id` | Return one job. | Public | All visitors. |
| PUT | `/api/jobs/:id` | Update a job with request fields. | Bearer JWT required | Any authenticated user; admin restriction is missing. |
| DELETE | `/api/jobs/:id` | Delete a job. | Bearer JWT required | Any authenticated user; admin restriction is missing. |
| PUT | `/api/jobs/:id/view` | Increment view count. | Public | All visitors. |

### GET `/api/jobs`

**Request body:** None.

**Response behavior**

- Returns HTTP 200 and an unpaginated array of every job.
- Returns HTTP 500 on query failure.

### POST `/api/jobs`

**Request body**

```json
{
  "title": "Software Engineer",
  "description": "<p>Rich text description</p>",
  "company": "Example Company",
  "location": "Bhopal",
  "applyLink": "https://example.com/apply",
  "applicationStartDate": "2026-06-01",
  "applicationEndDate": "2026-06-30",
  "category": "IT",
  "experience": "Fresher",
  "jobType": "Work from Home"
}
```

**Response behavior**

- Creates a new Job document.
- Returns HTTP 201 with the saved job.
- Returns HTTP 500 on validation or database errors.

**Authorization issue**

The frontend exposes this only to admins, but the backend accepts any valid user JWT.

### GET `/api/jobs/:id`

**Request body:** None.

**Response behavior**

- Returns HTTP 200 with the job.
- Returns HTTP 404 when not found.
- Invalid MongoDB IDs are handled as HTTP 500 rather than 400.

### PUT `/api/jobs/:id`

**Request body**

Any Job fields can be supplied because the controller passes `req.body` directly to `findByIdAndUpdate`.

**Response behavior**

- Returns HTTP 200 with the updated job.
- Returns HTTP 404 when not found.
- Returns HTTP 400 on update errors.

**Problems**

- No role check.
- No ownership check.
- No allowed-field whitelist.
- Mongoose update validators are not enabled with `runValidators: true`.

### DELETE `/api/jobs/:id`

**Request body:** None.

**Response behavior**

- Deletes the job.
- Returns HTTP 200 with a success message.
- Returns HTTP 404 if the job does not exist.

**Problems**

- No admin role check.
- Associated Application records are not deleted, creating orphaned data.

### PUT `/api/jobs/:id/view`

**Request body:** None.

**Response behavior**

- Loads the job.
- Increments `viewCount`.
- Saves and returns the updated job.

**Problems**

- Public and unrestricted, so view counts can be inflated.
- Uses a read-modify-write operation instead of atomic `$inc`.

## 5.3 Application routes

Base path: `/api/applications`

| Method | Endpoint | Purpose | Authentication | Role access |
|---|---|---|---|---|
| POST | `/api/applications` | Record a job application. | Public | Anyone. |
| GET | `/api/applications/job/:jobId` | Return applications for a job. | Public | Anyone; sensitive-data exposure. |
| GET | `/api/applications/:id` | Return one application. | Public | Anyone; sensitive-data exposure. |
| GET | `/api/applications/check/:jobId?email=...` | Check whether an email applied. | Public | Anyone; enumerable. |

### POST `/api/applications`

**Request body**

```json
{
  "jobId": "MongoDB job ObjectId",
  "name": "Candidate Name",
  "email": "candidate@example.com"
}
```

**Response behavior**

- Checks for an existing application with the same job ID and email.
- Returns HTTP 400 for a duplicate.
- Creates and returns an Application with HTTP 201.

**Problems**

- Not authenticated.
- Does not verify that the job exists.
- Does not link the application to the logged-in User.
- The catch block sends HTTP 501 and then tries to send HTTP 500, causing “headers already sent” behavior.
- HTTP 501 is not appropriate for a database or validation error.
- Duplicate prevention is not protected by a database unique index.

### GET `/api/applications/job/:jobId`

**Request body:** None.

**Response behavior**

- Returns all applications for a job.
- Exposes candidate names and email addresses publicly.

### GET `/api/applications/:id`

**Request body:** None.

**Response behavior**

- Returns one application.
- Returns HTTP 404 if missing.
- Is publicly accessible.

### GET `/api/applications/check/:jobId`

**Query**

```text
email=candidate@example.com
```

**Response**

```json
{
  "hasApplied": true
}
```

**Problem**

Anyone can test whether a known email address applied to a given job.

---

# 6. Database Schema Analysis

## 6.1 User model

**Collection model name:** `user`

| Field | Type | Rules | Purpose |
|---|---|---|---|
| `username` | String | Required | Display/login identity name. |
| `email` | String | Required, unique | Login identifier and password-reset destination. |
| `password` | String | Required | bcrypt-hashed local password. |
| `role` | String | Required, enum `user`, `admin` | Basic authorization role. |
| `resetPasswordToken` | String | Optional | Password-reset token. |
| `resetPasswordExpires` | Date | Optional | Reset-token expiration. |

### Methods and hooks

- A pre-save hook hashes a changed password with bcrypt and a generated salt.
- `comparePassword()` compares a supplied password against the stored hash.
- The pre-save hook attempts to normalize email, but its condition is reversed. New or modified emails are not converted to lowercase.

### Relationships

There are no references from User to jobs or applications, and Application does not reference User. Therefore:

- Users do not own their applications in the database.
- Admins do not own jobs.
- Recruiter relationships cannot be represented.

### Important limitations

- No timestamps option.
- No profile fields.
- No OAuth provider ID or provider type.
- No email-verification state.
- No account status.
- Password and reset fields are selected by default and returned by authentication controllers.

## 6.2 Job model

| Field | Type | Rules | Purpose |
|---|---|---|---|
| `title` | String | Required | Job title. |
| `description` | String | Required | Rich-text job description. |
| `company` | String | Required | Company display name. |
| `location` | String | Required | Job location. |
| `applyLink` | String | Required | External application URL. |
| `viewCount` | Number | Default 0 | Number of detail-page view increments. |
| `applicationStartDate` | String | Default `Not mentioned` | Application opening date. |
| `applicationEndDate` | String | Default `Not mentioned` | Application deadline. |
| `category` | String | Required | UI expects `IT` or `Non-IT`, but schema has no enum. |
| `experience` | String | Required, enum | `Fresher` or `Experienced`. |
| `jobType` | String | Required, enum | `Work from Home` or `In Office`. |
| `createdAt` | Date | Default current date | Posting timestamp. |

### Relationships

Job is referenced by Application through `jobId`.

### Important limitations

- No creator/admin/recruiter reference.
- No company reference.
- No salary, skills, vacancies, status, or expiry state.
- Dates are stored as strings rather than Date values.
- `Not mentioned` is not a valid date, but the frontend still passes it to `new Date()`.
- No schema timestamps or update timestamp.
- No indexes for search/filtering.
- No URL validation for `applyLink`.

## 6.3 Application model

| Field | Type | Rules | Purpose |
|---|---|---|---|
| `jobId` | ObjectId | Required, references `Job` | Identifies the applied job. |
| `name` | String | Required | Candidate-provided name. |
| `email` | String | Required | Candidate-provided email. |
| `appliedAt` | Date | Default current date | Application-record timestamp. |

### Relationships

- References Job.
- Does not reference User.

### Important limitations

- No application status.
- No resume or cover letter.
- No candidate/user reference.
- No recruiter notes.
- No status history.
- No compound unique index on job and user/email.
- No timestamps option.
- Deleting a job does not remove its applications.

## 6.4 Profile model

**Not found / not implemented.**

## 6.5 SavedJob model

**Not found / not implemented.**

## 6.6 Notification model

**Not found / not implemented.**

## 6.7 Other models

No other Mongoose models were found.

---

# 7. Authentication & Authorization Flow

## 7.1 Register flow

1. The user enters username, email, password, and role.
2. The frontend sends the form to `POST /api/auth/register`.
3. For an admin, the frontend first compares the code against a hardcoded value.
4. The backend separately compares the supplied code against `ADMIN_REGISTRATION_CODE`.
5. The backend checks for an existing email.
6. Mongoose creates the User.
7. The pre-save hook hashes the password.
8. The backend signs a JWT containing user ID and role.
9. The frontend stores the token and user object in `localStorage`.
10. Admins are redirected to the dashboard; normal users are redirected to the profile page.

### Concerns

- The frontend admin code exposes a privileged secret pattern.
- The backend must be the only authority for admin creation.
- User input is not validated or sanitized.
- The full user document, including password hash, is returned and stored in the browser.

## 7.2 Login flow

1. The frontend generates a six-character CAPTCHA.
2. CAPTCHA comparison occurs only in browser JavaScript.
3. Email and password are sent to `POST /api/auth/login`.
4. The backend finds the user and calls `comparePassword`.
5. A JWT is created.
6. The token and user object are stored in `localStorage`.
7. The user is redirected based on role.

The CAPTCHA can be bypassed by calling the API directly and therefore is not a security control.

## 7.3 JWT generation

JWTs are signed with:

- Payload: user ID and role.
- Secret: `JWT_SECRET`.
- Expiry: `ACCESS_TOKEN_EXPIRY`.

Refresh-token environment variables exist but are not used.

## 7.4 Password hashing

Passwords are hashed in the User model pre-save hook with bcrypt:

- A salt is generated with cost factor 10.
- The password is hashed before storage.
- Login uses bcrypt comparison.
- Resetting a password triggers hashing because the password field changes.

This is a sound overall pattern, but password hashes must be excluded from API responses.

## 7.5 Protected routes

Backend protection exists only for:

- Create job.
- Update job.
- Delete job.

The middleware:

1. Reads the Authorization header.
2. Removes the `Bearer ` prefix.
3. Verifies the token.
4. loads the User without the password.
5. places the user on `req.user`.

### Middleware bug

`req.header('Authorization').replace(...)` is called before checking whether the header exists. A missing header can cause a TypeError, which is caught and returned as “Token is not valid” rather than the intended “No token” response.

## 7.6 Role-based access control

### Frontend

`PrivateRoute` checks:

- Whether a user object exists.
- Whether the user role is included in the route’s allowed roles.

The admin dashboard allows only `admin`. The profile allows `user` and `admin`.

### Backend

**Role-based authorization is not implemented.**

The JWT role is generated but never checked by backend route middleware. Consequently, any logged-in normal user can create, update, or delete jobs by directly calling the API.

Frontend route guards improve navigation but cannot provide security.

## 7.7 Frontend auth handling

- React Context stores the current user.
- `localStorage` persists the JWT and user.
- Axios automatically adds the bearer token.
- Logout clears both values.

Limitations:

- No token validation on reload.
- No current-user endpoint.
- No automatic logout on HTTP 401.
- No token refresh.
- Local storage is vulnerable to token theft if an XSS issue occurs.
- A tampered local `user` object can bypass frontend role display logic, although secure backend RBAC would still need to block privileged actions.
- Two nested `AuthProvider` instances are rendered.

---

# 8. Frontend Flow Analysis

## 8.1 Page routing

| Route | Access | Component | Purpose |
|---|---|---|---|
| `/` | Public | Home | Job listing, search, and filters. |
| `/about` | Public | About | Static project/company information. |
| `/job/:id` | Public | JobDetails | Job details, share tools, and apply form. |
| `/register` | Public | Register | User/admin registration. |
| `/login` | Public | Login | Local and intended Google login. |
| `/forgot-password` | Public | ForgotPassword | Password-reset request. |
| `/reset-password/:token` | Public | ResetPassword | Password reset completion. |
| `/admin/dashboard` | Admin frontend guard | AdminDashboard | Nested admin shell. |
| `/admin/dashboard/jobs` | Admin frontend guard | ManageJobs | View and delete jobs. |
| `/admin/dashboard/add-job` | Admin frontend guard | AddJob | Create a job. |
| `/profile` | User/admin frontend guard | UserProfile | Placeholder profile. |
| `*` | Public | PageNotFound | 404 fallback. |

The bare `/admin/dashboard` route renders the dashboard shell without a default child page, so the main content area is empty until a nested link is selected.

## 8.2 Main pages

### Home

- Fetches all jobs from the API.
- Stores original and filtered arrays in component state.
- Applies client-side filters.
- Displays responsive job cards.

### Job Details

- Fetches the selected job.
- Increments its view count on page load.
- Checks application status for logged-in users.
- Displays rich-text description through React Quill.
- Records the application and opens the external apply link.
- Supports social sharing and URL copying.
- Displays a non-functional Save button.

### Admin Dashboard

- Uses nested routes and a responsive sidebar.
- Links to manage jobs and add jobs.

### Manage Jobs

- Fetches all jobs.
- Deletes a selected job.
- Displays an Edit button, but editing is not implemented.
- Calls an undefined `setError` in error paths, causing another runtime error if fetch or delete fails.

### User Profile

- Displays the username.
- Shows a maintenance graphic.
- Does not read or update profile information.

## 8.3 Dashboard flow

1. An admin logs in or registers.
2. The frontend redirects to `/admin/dashboard`.
3. The admin selects Manage Jobs or Add New Job.
4. Add Job submits a protected POST request with the bearer token.
5. Manage Jobs loads all jobs through a public GET request.
6. Delete submits a protected DELETE request.

The frontend flow looks role-protected, but the backend does not verify the admin role.

## 8.4 API integration

The active API layer is centralized in `src/utils/api.js`. Components call relative paths such as:

```text
/auth/login
/auth/register
/jobs
/applications
```

The Axios interceptor attaches the JWT automatically.

Concerns:

- Production API origin is hardcoded.
- Vite’s `/api` proxy is bypassed because Axios uses an absolute production URL.
- Google OAuth uses a route without the `/auth` prefix.
- Placeholder API wrappers under `src/api/` duplicate concepts and are unused.

## 8.5 State management

The application uses:

- Local React state for forms, jobs, filters, loading, and errors.
- React Context for authentication.
- Browser local storage for persistence.

Redux is installed but not used. For the current project size, Context and local state are reasonable, but server-state caching and invalidation would become useful as the product grows.

## 8.6 Form handling

Forms are controlled React forms. Browser `required` attributes and a few manual checks are used.

Implemented checks include:

- Required login and registration fields.
- Client-side CAPTCHA.
- Password confirmation during reset.
- Name/email presence on apply.
- Apply email matching the logged-in user in the UI.

Limitations:

- No form library or shared validation schema.
- No server-side equivalent for most frontend checks.
- No password policy.
- No URL validation.
- No robust date validation.
- No field length limits.

## 8.7 Protected pages

`PrivateRoute` protects dashboard and profile navigation. It depends on the locally stored user object. It does not confirm the session with the server, and backend RBAC does not match the frontend role restrictions.

---

# 9. Deployment Analysis

## 9.1 Environment variables

Variables found in the sample or active configuration include:

| Variable | Purpose |
|---|---|
| `PORT` | Express server port. |
| `MONGODB_URI` | MongoDB Atlas/server connection prefix. |
| `CORS_ORIGIN` | Allowed frontend origin. |
| `JWT_SECRET` | JWT signing and verification secret. |
| `ACCESS_TOKEN_EXPIRY` | JWT lifetime. |
| `ACCESS_TOKEN_SECRET` | Present but unused. |
| `REFRESH_TOKEN_SECRET` | Present but unused. |
| `REFRESH_TOKEN_EXPIRY` | Present but unused. |
| `ADMIN_REGISTRATION_CODE` | Admin signup code; missing from `.env.sample`. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID; missing from `.env.sample`. |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret; missing from `.env.sample`. |
| `CLOUDINARY_CLOUD_NAME` | Unused upload configuration. |
| `CLOUDINARY_API_KEY` | Unused upload configuration. |
| `CLOUDINARY_API_SECRET` | Unused upload configuration. |
| `EMAIL_HOST` | SMTP host. |
| `EMAIL_PORT` | SMTP port. |
| `EMAIL_USERNAME` | SMTP username/from address. |
| `EMAIL_PASSWORD` | SMTP password. |
| `CLIENT_URL` | Frontend base URL in reset emails. |

The real `.env` is correctly ignored. The sample file contains a specific Atlas username/cluster pattern and should use a fully generic placeholder.

## 9.2 Build process

### Frontend

```bash
npm install
npm run build
```

Vite outputs to `frontend/dist`.

### Backend

```bash
npm install
npm start
```

The start script runs `node server.js`.

There is no root script to install/build both applications.

## 9.3 Frontend deployment

The frontend can be deployed independently to Netlify, Vercel, Render Static Sites, or a similar service using:

- Root directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Required improvements:

- Replace the hardcoded API URL with `VITE_API_BASE_URL`.
- Add SPA fallback/rewrite configuration for React Router.
- Move the Google client ID to a Vite environment variable.

No Netlify or Vercel configuration file currently exists.

## 9.4 Backend deployment

The hardcoded Render API URL suggests that the backend has been or is intended to be deployed on Render.

A likely Render setup is:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment: Node

There is no infrastructure configuration file, so the deployment is configured manually or is incomplete.

## 9.5 MongoDB Atlas usage

MongoDB Atlas is strongly indicated by the `mongodb+srv` sample URI.

The connection logic appends `/JobPortal`:

```text
MONGODB_URI + /JobPortal
```

Deployment must ensure:

- The Atlas network access list allows the backend host.
- Database credentials are stored only in environment variables.
- The URI format remains compatible with the appended database path.
- Appropriate production indexes are created.

## 9.6 Combined frontend/backend serving issue

`backend/app.js` attempts to serve:

```text
backend/frontend/dist
```

The real frontend is a sibling directory:

```text
OpportunityX/frontend/dist
```

Therefore, the static path and catch-all `index.html` path do not match the repository structure. A combined Render web service would fail to serve the built frontend unless the build layout or path is changed.

The catch-all route also runs after API routes and can try to return the missing frontend file for unknown API endpoints.

## 9.7 Additional deployment risks

- The sample backend port is 8000, the Vite proxy targets 8001, and the backend fallback is 5000. Local setup is inconsistent.
- The absolute production API URL bypasses the Vite development proxy.
- `CORS_ORIGIN=*` combined with `credentials: true` is not a valid credentialed browser CORS configuration.
- SMTP uses `secure: true` unconditionally, which may be incompatible with ports such as 587 or 2525.
- No health-check endpoint exists.
- No production logging, monitoring, or graceful shutdown exists.
- No automated tests or CI/CD workflow exists.

---

# 10. Code Quality Review

## 10.1 Strengths

- Clear separation between frontend and backend.
- Conventional backend layering: routes, controllers, models, middleware, config, and utilities.
- Reusable React components for navigation, layout, loading, authentication forms, and route protection.
- Page-level lazy loading with Suspense.
- Centralized Axios instance and token interceptor.
- Responsive Tailwind layouts.
- Mongoose schema constraints for required fields and selected enums.
- bcrypt password hashing is handled at the model layer.
- JWT expiry is configurable.
- Password reset tokens have an expiry.
- Duplicate application behavior is considered.
- Job not-found and application not-found cases are handled.
- Secrets are stored in an ignored `.env` file rather than committed application code.

## 10.2 Good practices already present

- Passwords are not stored in plain text.
- The auth middleware reloads the user from the database.
- The password-reset token is cleared after use.
- Frontend routes are split into public and role-based groups.
- API calls generally use try/catch and user feedback.
- The UI is structured into components instead of one large page.
- Rich-text content is handled through a dedicated editor.
- The application has a fallback 404 page.

## 10.3 Reusable components

Reusable components include:

- Navbar
- Footer
- Logo
- LoadingDots
- PrivateRoute
- Authentication forms

The next quality step would be extracting shared form controls, buttons, page containers, job cards, filter controls, and error/loading states.

## 10.4 Security practices

Positive:

- bcrypt hashing.
- JWT expiration.
- Environment-held secrets.
- Password reset expiry.
- Authorization headers for protected calls.

Needs improvement:

- Backend RBAC.
- Response field filtering.
- API validation.
- Rate limiting.
- Security headers.
- OAuth repair.
- Input and rich-text sanitization.
- Password-reset token hashing.

## 10.5 Error handling

Controllers consistently attempt to return status codes and JSON messages, and frontend forms show toast feedback. However:

- There is no centralized Express error middleware.
- Raw error objects are sometimes returned.
- Status codes are inconsistent.
- One controller sends two responses in one catch block.
- Some frontend error handlers contain their own runtime error.
- Error messages are not normalized.

## 10.6 Testing and maintainability

- Jest and Supertest are installed, but no tests were found.
- No backend lint script exists.
- The frontend has ESLint and Prettier configuration.
- Large blocks of commented-out code remain.
- Placeholder API files and unused dependencies increase confusion.
- No API documentation or README specific to OpportunityX exists.

---

# 11. Problems / Bugs / Risks

## 11.1 Critical and high-risk issues

### 1. Backend admin authorization is missing

Any authenticated `user` can create, update, or delete jobs. The backend never checks `req.user.role`.

### 2. Authentication responses expose password hashes

Registration and login return the full Mongoose user document. The hash is then stored in browser local storage. Reset-token fields may also be exposed when present.

### 3. Application data is publicly accessible

Names and email addresses can be retrieved without authentication through application endpoints.

### 4. Application identity is not trusted

The backend accepts any name and email. The frontend email comparison can be bypassed by direct API access.

### 5. Admin registration secret is exposed in frontend code

The registration page contains a hardcoded admin-code comparison. Even if the server code differs, publishing a privileged code pattern client-side is unsafe.

### 6. Google OAuth is broken

The route path, frontend provider, backend OAuth client export, User schema requirements, and response handling do not align.

### 7. Static deployment path is wrong

The backend expects a frontend build inside `backend/frontend/dist`, which does not exist in this repository structure.

## 11.2 Functional bugs

### Authentication middleware missing-header handling

The middleware calls `.replace()` before confirming the Authorization header exists.

### Application controller double response

The create-application catch block sends HTTP 501 and then attempts HTTP 500.

### ManageJobs error path

`setError` is called but is never declared.

### Google API path mismatch

The frontend requests `/api/google`; the backend route is `/api/auth/google`.

### Google provider is not rendered

A `GoogleAuthWrapper` is defined but unused. `GoogleLogin` uses the OAuth hook outside the required provider.

### Google-created User fails schema validation

The creation omits required `password` and `role` fields.

### Google client export mismatch

The configuration exports `{ oauth2Client }`, while the controller treats the entire object as the client.

### Email normalization condition is reversed

Email lowercasing is performed only when the email is not modified, which does not normalize new registration emails.

### Invalid date display

`Not mentioned` is converted through `new Date()` and can render as `Invalid Date`.

### Admin dashboard default view is empty

No index route redirects to or renders the job list.

### Save button is non-functional

It has no click handler or persistence.

### Job Edit button is non-functional

It only displays an alert.

## 11.3 Security risks

- No server-side role middleware.
- No request validation library.
- No rate limiting for login, registration, password reset, application submission, or view counts.
- Helmet is installed but not used.
- No explicit content sanitization for rich-text job descriptions.
- `applyLink` is not validated or restricted to safe HTTP/HTTPS URLs.
- Reset tokens are stored unhashed.
- Forgot-password responses allow email enumeration.
- JWTs remain valid after password reset or account changes.
- Token storage in local storage increases impact of XSS.
- CORS configuration is overly broad in the sample.
- Error objects may leak internal database details.
- No CSRF issue currently applies to bearer-token headers in the same way as cookies, but a future cookie migration would require CSRF protection.
- View counts can be manipulated.

## 11.4 Missing validation

Missing or incomplete validation includes:

- Username length and format.
- Email normalization and validation beyond basic Mongoose/browser behavior.
- Password length and strength.
- Allowed registration roles at the controller boundary.
- Job title/description/company/location lengths.
- Category enum.
- URL validation.
- Start/end date ordering.
- ObjectId format.
- Application email and name normalization.
- Job existence before application.

## 11.5 Hardcoded values

- Production API URL.
- Google OAuth client ID in `App.jsx`.
- Admin code check in the registration component.
- Password-reset email logo URL.
- Company identity and contact details.
- Local proxy port.
- Job categories and filters.
- Fixed three-second initial loading delay.

## 11.6 Broken or inconsistent routes

- Frontend Google route does not match backend.
- Footer links for Services, Contact, and Privacy have no corresponding routes.
- Placeholder API functions call nonexistent `/api/login`, `/api/logout`, and `/api/user` endpoints.
- Backend static SPA path does not match the actual frontend folder.

## 11.7 Unused files, packages, or code

- `frontend/src/api/auth.js`.
- `frontend/src/api/job.js`.
- `GoogleSignIn` import and unused `GoogleAuthWrapper`.
- Axios import in the auth context.
- Redux and React Redux.
- TinyMCE React package.
- Cloudinary and Multer configuration.
- Helmet.
- Jest and Supertest.
- Refresh-token environment values.
- Large commented-out implementations in `App.jsx`, `server.js`, and `auth.jsx`.

## 11.8 Duplicate or unnecessary code

- `AuthProvider` is rendered in both `main.jsx` and `App.jsx`.
- Admin-code validation is duplicated in the backend controller.
- Multiple ToastContainers are mounted in page components and globally.
- Login stores the token directly and then calls a context function that stores it again.
- Job cards contain nested links to the same destination.

## 11.9 Data design risks

- Applications become orphaned when jobs are deleted.
- Application duplicate checks are vulnerable to race conditions.
- Jobs have no owner.
- Applications have no user reference.
- String dates reduce query and validation quality.
- No pagination means response size grows without limit.
- No timestamps on User or Application.
- No indexes for common job filters or application lookups.

## 11.10 User experience and accessibility concerns

- Artificial three-second startup delay.
- Some click actions use non-button spans.
- Error mode replaces the entire application instead of allowing retry.
- Error image path uses `../public/...`, which is not the standard Vite public asset path.
- Some text contains visible character-encoding artifacts.
- External application opening does not explicitly protect against opener access.
- Missing loading/disabled states during form submission can allow repeated requests.
- The profile page and multiple footer routes are placeholders.

---

# 12. Improvement Roadmap

## 12.1 High priority fixes

1. Add backend role middleware and require `admin` for job creation, update, and deletion.
2. Return safe user DTOs that exclude password and reset-token fields.
3. Protect application retrieval with admin/recruiter authorization.
4. Protect application creation and derive candidate identity from `req.user`.
5. Add request validation with a shared schema library such as Zod, Joi, or express-validator.
6. Remove client-side admin signup and create admins through a secure seed, CLI, or controlled admin action.
7. Fix authentication middleware handling for missing headers and missing users.
8. Fix Google OAuth end to end or temporarily remove the non-working option.
9. Fix the application controller’s double-response bug.
10. Add `setError` state or proper toast handling in ManageJobs.
11. Move API URL and Google client ID to frontend environment variables.
12. Correct the deployment structure or deploy frontend and backend separately.
13. Add rate limiting, Helmet, secure CORS settings, and safer error responses.
14. Normalize emails correctly and enforce case-insensitive uniqueness.
15. Store hashed password-reset tokens and use generic forgot-password responses.
16. Validate and sanitize job HTML and external URLs.

## 12.2 Medium priority improvements

1. Add a proper `candidate` and `recruiter` role model.
2. Add Job ownership with `createdBy` and/or `company`.
3. Create a Profile model and profile CRUD APIs.
4. Add resume upload using a consistent ES-module Cloudinary/Multer implementation.
5. Add application status values such as Applied, Reviewing, Shortlisted, Interview, Rejected, and Hired.
6. Add candidate application history.
7. Implement job editing.
8. Implement SavedJob persistence and a saved-jobs page.
9. Implement a Notification model and read/unread state.
10. Store job dates as Date values.
11. Add pagination, sorting, server-side filters, and MongoDB indexes.
12. Add database-level unique indexes for applications.
13. Cascade or explicitly manage applications when jobs are deleted.
14. Add a `/me` endpoint and 401 response handling.
15. Remove duplicate providers, placeholder files, commented code, and unused dependencies.
16. Add reusable form components and consistent loading/error states.
17. Add backend and frontend automated tests.
18. Add a complete project README and API documentation.

## 12.3 Advanced future features

- Email verification before application access.
- Secure forgot-password improvements and session revocation.
- Resume upload, versioning, and preview.
- Resume parsing to extract skills, education, and experience.
- AI-based job recommendations using candidate skills and behavior.
- Semantic job search.
- Candidate-job match scoring.
- Interview scheduling with calendar integration.
- Recruiter-candidate real-time chat.
- Real-time notifications using Socket.IO or a managed event service.
- Email notifications for application status changes.
- Recruiter company pages and verification.
- Admin analytics for jobs, views, applications, users, and conversion rates.
- Recruiter analytics for listing performance.
- Moderation queues and audit logs.
- Saved searches and job alerts.
- Role-aware dashboards.
- Resume-based one-click applications.
- Accessibility audit and internationalization.
- CI/CD, monitoring, structured logging, and automated database backups.

---

# 13. Resume-Ready Project Summary

## 13.1 Two-line resume description

Built OpportunityX, a MERN-stack job portal with responsive job discovery, multi-filter search, JWT authentication, password recovery, external application tracking, and an admin job-management dashboard.  
Designed REST APIs with Express and MongoDB, integrated bcrypt security and React route protection, and created a reusable Tailwind-based frontend with rich-text job publishing.

## 13.2 Four strong resume bullet points

- Developed a full-stack MERN job portal using React, Vite, Express, MongoDB, and Mongoose, with separate frontend and backend architecture.
- Implemented JWT-based authentication, bcrypt password hashing, role-aware frontend routing, and email-based password reset functionality.
- Built job publishing, listing, detail, search, multi-criteria filtering, view tracking, sharing, and basic application-recording workflows.
- Created a responsive Tailwind CSS interface with lazy-loaded routes, reusable components, centralized Axios integration, and a rich-text job description editor.

These bullets describe the implemented code accurately. Avoid claiming recruiter dashboards, resume uploads, saved jobs, notifications, or AI recommendations until those features are actually built.

## 13.3 Simple interview explanation

“OpportunityX is a MERN-stack job portal that I built to practice a complete frontend-to-backend workflow. Users can browse and filter jobs, create an account, reset their password, view job details, and record that they applied before continuing to an external application page. Admin users have a dashboard where they can publish and remove jobs. React handles the interface and protected page navigation, Express provides the REST APIs, MongoDB stores users, jobs, and applications, and JWT plus bcrypt handles authentication and password security.

The project currently works mainly as an administrator-managed job board. While reviewing it, I identified that production readiness requires stronger backend role authorization, safer API responses, protected application data, validation, and a repaired Google login flow. My next architectural step would be to add separate candidate and recruiter roles, job ownership, real profiles and resumes, and full application status management.”

---

# 14. Final Conclusion

OpportunityX proves that the developer can build and connect the major layers of a MERN application:

- Design a responsive React interface.
- Structure reusable frontend components.
- Configure client-side routing and protected pages.
- Build Express routes and controllers.
- Model data with Mongoose.
- Integrate authentication with JWT and bcrypt.
- Implement password-reset email delivery.
- Connect forms to REST APIs.
- Create search, filtering, rich-text content, and admin workflows.
- Prepare separate frontend and backend applications for deployment.

The project is a credible portfolio-level full-stack foundation, especially for demonstrating end-to-end development and practical CRUD/authentication experience. It should currently be presented honestly as an **admin-managed job portal with candidate job discovery and basic application tracking**, not yet as a complete recruiter marketplace.

The most valuable next step is not adding many visual features at once. It is strengthening the security and data model: enforce backend roles, stop exposing sensitive user and application data, add validation, connect applications to authenticated users, and introduce recruiter/job ownership. Completing those changes would move OpportunityX from a strong learning project toward a production-oriented hiring platform.

---

## Appendix A: Actual Models Found

```text
User
Job
Application
```

Not found:

```text
Profile
SavedJob
Notification
Recruiter
Company
Resume
Interview
Message
```

## Appendix B: Actual API Surface

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/google
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id
PUT    /api/jobs/:id/view

POST   /api/applications
GET    /api/applications/job/:jobId
GET    /api/applications/:id
GET    /api/applications/check/:jobId
```

## Appendix C: Overall Assessment

| Dimension | Assessment |
|---|---|
| Full-stack integration | Good foundation |
| Frontend structure | Good for project size |
| Backend structure | Clear but needs middleware and validation layers |
| Database design | Basic and functional; missing ownership and domain depth |
| Authentication | Local auth works conceptually; response security and OAuth need fixes |
| Authorization | Insufficient on backend |
| Candidate workflow | Partial |
| Recruiter workflow | Not implemented |
| Admin workflow | Partial |
| Deployment readiness | Partial; configuration and path issues remain |
| Production readiness | Not yet production-ready |

