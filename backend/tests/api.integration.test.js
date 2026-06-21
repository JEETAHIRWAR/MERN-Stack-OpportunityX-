import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import Notification from "../models/Notification.js";
import Company from "../models/Company.js";

const credentials = {
  candidate: {
    username: "Candidate One",
    email: "candidate@example.com",
    password: "candidate-password",
    role: "candidate",
  },
  recruiter: {
    username: "Recruiter One",
    email: "recruiter@example.com",
    password: "recruiter-password",
    role: "recruiter",
  },
  recruiterTwo: {
    username: "Recruiter Two",
    email: "recruiter-two@example.com",
    password: "recruiter-two-password",
    role: "recruiter",
  },
  admin: {
    username: "Admin One",
    email: "admin@example.com",
    password: "admin-password",
    role: "admin",
    code: "integration-admin-code",
  },
};

const jobPayload = (title = "Backend Engineer") => ({
  title,
  description: "<p>Build secure APIs.</p>",
  company: "OpportunityX Labs",
  location: "Remote",
  applyLink: "https://example.com/apply",
  category: "IT",
  experience: "Experienced",
  jobType: "Work from Home",
});

const register = async (account) => {
  const response = await request(app).post("/api/auth/register").send(account);
  expect(response.status).toBe(201);
  if (account.role === "recruiter") {
    await Company.create({
      owner: response.body.user._id,
      name: `${account.username} Company`,
      verificationStatus: "verified",
    });
  }
  return response.body;
};

const auth = (token) => ({ Authorization: `Bearer ${token}` });

describe("OpportunityX production authorization and data flows", () => {
  test("register and login never expose password or reset fields", async () => {
    const registration = await register(credentials.candidate);

    expect(registration.user).not.toHaveProperty("password");
    expect(registration.user).not.toHaveProperty("resetPasswordToken");
    expect(registration.user).not.toHaveProperty("resetPasswordExpires");

    const login = await request(app).post("/api/auth/login").send({
      email: credentials.candidate.email,
      password: credentials.candidate.password,
    });

    expect(login.status).toBe(200);
    expect(login.body.user).not.toHaveProperty("password");
    expect(login.body.user).not.toHaveProperty("resetPasswordToken");
    expect(login.body.user).not.toHaveProperty("resetPasswordExpires");
  });

  test("candidate authorization blocks recruiter and admin operations", async () => {
    const candidate = await register(credentials.candidate);

    const createJob = await request(app)
      .post("/api/jobs")
      .set(auth(candidate.token))
      .send(jobPayload());
    const adminDashboard = await request(app)
      .get("/api/admin/dashboard")
      .set(auth(candidate.token));

    expect(createJob.status).toBe(403);
    expect(adminDashboard.status).toBe(403);
  });

  test("recruiter authorization permits job creation but blocks admin APIs", async () => {
    const recruiter = await register(credentials.recruiter);

    const createJob = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload());
    const adminDashboard = await request(app)
      .get("/api/admin/dashboard")
      .set(auth(recruiter.token));

    expect(createJob.status).toBe(201);
    expect(adminDashboard.status).toBe(403);
  });

  test("unverified recruiters can save drafts but cannot publish", async () => {
    const response = await request(app).post("/api/auth/register").send({
      ...credentials.recruiter,
      email: "verification-flow@example.com",
    });
    const recruiter = response.body;

    const rejectedPublish = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload("Blocked published job"));
    const draft = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send({ ...jobPayload("Allowed draft"), status: "Draft" });

    expect(rejectedPublish.status).toBe(403);
    expect(draft.status).toBe(201);
    expect(draft.body.status).toBe("Draft");
  });

  test("auth/me returns the current recruiter verification status", async () => {
    const recruiter = await register(credentials.recruiter);
    const response = await request(app)
      .get("/api/auth/me")
      .set(auth(recruiter.token));

    expect(response.status).toBe(200);
    expect(response.body.user.verificationStatus).toBe("verified");
  });

  test("admin authorization can access platform APIs and manage jobs", async () => {
    const admin = await register(credentials.admin);

    const dashboard = await request(app)
      .get("/api/admin/dashboard")
      .set(auth(admin.token));
    const createJob = await request(app)
      .post("/api/jobs")
      .set(auth(admin.token))
      .send(jobPayload("Admin Managed Job"));

    expect(dashboard.status).toBe(200);
    expect(createJob.status).toBe(201);
  });

  test("recruiters can manage only jobs they own", async () => {
    const owner = await register(credentials.recruiter);
    const otherRecruiter = await register(credentials.recruiterTwo);
    const created = await request(app)
      .post("/api/jobs")
      .set(auth(owner.token))
      .send(jobPayload());

    const forbiddenUpdate = await request(app)
      .put(`/api/jobs/${created.body._id}`)
      .set(auth(otherRecruiter.token))
      .send({ title: "Unauthorized change" });
    const ownerUpdate = await request(app)
      .put(`/api/jobs/${created.body._id}`)
      .set(auth(owner.token))
      .send({ title: "Authorized change" });

    expect(forbiddenUpdate.status).toBe(403);
    expect(ownerUpdate.status).toBe(200);
    expect(ownerUpdate.body.title).toBe("Authorized change");
  });

  test("duplicate applications are rejected by the database constraint", async () => {
    const recruiter = await register(credentials.recruiter);
    const candidate = await register(credentials.candidate);
    const job = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload());

    const first = await request(app)
      .post("/api/applications")
      .set(auth(candidate.token))
      .send({ jobId: job.body._id });
    const duplicate = await request(app)
      .post("/api/applications")
      .set(auth(candidate.token))
      .send({ jobId: job.body._id });

    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
    expect(await Application.countDocuments()).toBe(1);
  });

  test("saving the same job is idempotent", async () => {
    const recruiter = await register(credentials.recruiter);
    const candidate = await register(credentials.candidate);
    const job = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload());

    const first = await request(app)
      .post(`/api/saved-jobs/${job.body._id}`)
      .set(auth(candidate.token));
    const second = await request(app)
      .post(`/api/saved-jobs/${job.body._id}`)
      .set(auth(candidate.token));

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);
    expect(await SavedJob.countDocuments()).toBe(1);
  });

  test("application status changes create a candidate notification", async () => {
    const recruiter = await register(credentials.recruiter);
    const candidate = await register(credentials.candidate);
    const job = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload());
    const application = await request(app)
      .post("/api/applications")
      .set(auth(candidate.token))
      .send({ jobId: job.body._id });

    const update = await request(app)
      .patch(`/api/applications/${application.body._id}`)
      .set(auth(recruiter.token))
      .send({ status: "Shortlisted", recruiterNotes: "Strong profile" });

    const notification = await Notification.findOne({
      user: candidate.user._id,
    });
    expect(update.status).toBe(200);
    expect(update.body.status).toBe("Shortlisted");
    expect(notification?.message).toContain("Shortlisted");
  });

  test("deleting a job cleans up applications and saved-job records", async () => {
    const recruiter = await register(credentials.recruiter);
    const candidate = await register(credentials.candidate);
    const job = await request(app)
      .post("/api/jobs")
      .set(auth(recruiter.token))
      .send(jobPayload());

    await request(app)
      .post("/api/applications")
      .set(auth(candidate.token))
      .send({ jobId: job.body._id });
    await request(app)
      .post(`/api/saved-jobs/${job.body._id}`)
      .set(auth(candidate.token));

    const deletion = await request(app)
      .delete(`/api/jobs/${job.body._id}`)
      .set(auth(recruiter.token));

    expect(deletion.status).toBe(200);
    expect(await Job.countDocuments()).toBe(0);
    expect(await Application.countDocuments()).toBe(0);
    expect(await SavedJob.countDocuments()).toBe(0);
  });
});
