# OpportunityX

OpportunityX is a MERN hiring platform for candidates, verified recruiters, and
administrators. It includes secure role authorization, recruiter verification,
job and applicant management, notifications, messaging, analytics, managed
uploads, job alerts, and an optional OpenAI-powered copilot layer.

## Applications

- `frontend`: React, Vite, Tailwind CSS
- `backend`: Express, Mongoose, MongoDB, Socket.IO

## Local setup

```powershell
npm --prefix backend install
npm --prefix frontend install
npm --prefix backend run dev
npm --prefix frontend run dev
```

Copy the environment samples and configure MongoDB, JWT, CORS, frontend API
origin, SMTP, Cloudinary, and optional OpenAI settings.

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8001/api
```

Backend minimum:

```env
PORT=8001
MONGODB_URI=
JWT_SECRET=
CORS_ORIGINS=http://localhost:5173
CLIENT_URL=http://localhost:5173
```

See [DEPLOYMENT.md](DEPLOYMENT.md), [TESTING_GUIDE.md](TESTING_GUIDE.md),
[AI_ARCHITECTURE.md](AI_ARCHITECTURE.md), and
[IMPLEMENTATION_AUDIT.md](IMPLEMENTATION_AUDIT.md).

