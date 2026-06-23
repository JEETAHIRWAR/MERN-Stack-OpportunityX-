# OpportunityX Testing Guide

## Automated checks

```powershell
npm --prefix frontend run lint
npm --prefix frontend run test:auth
npm --prefix frontend run build
npm --prefix backend test
```

Backend tests use an isolated in-memory MongoDB database.

## Candidate flow

1. Register as candidate.
2. If SMTP is configured, verify the six-digit email code.
3. Login and update profile.
4. Upload a resume after Cloudinary is configured.
5. Browse, save, apply, and withdraw an application.
6. Create a job alert.
7. Review notifications and mark all read.
8. Open a recruiter-created conversation.
9. Configure preferences and change password.
10. Configure OpenAI and test candidate copilot/resume analysis.

## Recruiter flow

1. Register as recruiter.
2. Complete company profile and upload a logo.
3. Submit verification and confirm publishing remains blocked.
4. Admin approves the company.
5. Publish, pause, close, and edit owned jobs.
6. Filter applicants, update status, save notes, and start a conversation.
7. Confirm the candidate receives a real-time notification.
8. Review job conversion analytics.
9. Test recruiter AI generation after OpenAI configuration.

## Admin flow

1. Login with a securely provisioned admin.
2. Review/suspend/reactivate users.
3. Approve or reject recruiters with notes.
4. Approve, flag, or reject jobs with a reason.
5. Review applications, analytics, and summary reports.

## Real-time testing

Open candidate and recruiter sessions in separate browsers. Start an
application conversation, type in one browser, and confirm typing/message events
appear in the other. Update an application status and confirm the candidate
notification appears without refreshing.

