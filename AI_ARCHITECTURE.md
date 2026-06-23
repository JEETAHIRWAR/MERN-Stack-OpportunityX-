# OpportunityX AI Architecture

## Design goals

- Real provider calls only; no demo responses.
- Provider-replaceable service boundary.
- Persisted outputs for user history, debugging, and future evaluations.
- Explainable, structured JSON outputs.
- Role authorization on every AI route.
- No API keys or provider secrets sent to the browser.

## Current implementation

`backend/services/ai/openAiProvider.js` owns the OpenAI Responses API call.
Controllers depend on `generateAiJson`, not on an SDK-specific client.

Required environment:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
```

If either variable is missing, AI endpoints return `503` and the frontend shows
the configuration error. This prevents fake or silently degraded output.

## Routes

| Method | Route | Role | Purpose |
| --- | --- | --- | --- |
| POST | `/api/ai/candidate/copilot` | Candidate | Career guidance and actions |
| POST | `/api/ai/resume/analyze` | Candidate | Structured resume analysis |
| POST | `/api/ai/recommendations/jobs` | Candidate | Explainable job ranking |
| POST | `/api/ai/recruiter/copilot` | Recruiter/Admin | Job descriptions, screening, summaries, interview questions |
| GET | `/api/ai/insights` | Authenticated | Recent persisted AI outputs |

## Persistence

`AiInsight` stores:

- user
- insight type
- sanitized input payload
- structured output
- provider
- model
- timestamps

## Remaining AI work

- Parse uploaded PDF/DOCX content before resume analysis.
- Add schema validation and repair for provider JSON.
- Add prompt/version identifiers and evaluation datasets.
- Add per-user AI rate limiting and usage budgets.
- Add applicant ranking endpoints with recruiter ownership checks.
- Add admin hiring-insight prompts over aggregated, privacy-safe data.
- Add streaming responses for copilot chat.

Official API reference: https://developers.openai.com/api/docs

