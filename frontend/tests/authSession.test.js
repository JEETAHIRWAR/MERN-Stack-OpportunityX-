import assert from "node:assert/strict";
import test from "node:test";
import {
  getRoleRedirect,
  normalizeAuthResponse,
  persistAuthSession,
} from "../src/auth/authSession.js";

test("normalizes auth responses without sensitive fields", () => {
  const session = normalizeAuthResponse({
    token: "signed-token",
    user: {
      _id: "candidate-id",
      username: "Candidate",
      email: "candidate@example.com",
      role: "candidate",
      password: "hashed-password",
      resetPasswordToken: "secret-token",
    },
  });

  assert.equal(session.token, "signed-token");
  assert.equal(session.user.role, "candidate");
  assert.equal("password" in session.user, false);
  assert.equal("resetPasswordToken" in session.user, false);
});

test("persists the deployed response shape without password data", () => {
  const values = new Map();
  const storage = {
    setItem(key, value) {
      values.set(key, value);
    },
  };

  const user = persistAuthSession(
    {
      token: "signed-token",
      user: {
        _id: "recruiter-id",
        username: "Recruiter",
        email: "jeetahirwar664@gmail.com",
        role: "recruiter",
        verificationStatus: "verified",
        password: "must-not-be-stored",
      },
    },
    storage,
  );

  assert.equal(user.verificationStatus, "verified");
  assert.equal(values.get("token"), "signed-token");
  assert.deepEqual(JSON.parse(values.get("user")), user);
  assert.equal("password" in JSON.parse(values.get("user")), false);
});

test("allows missing optional user fields", () => {
  const session = normalizeAuthResponse({
    token: "signed-token",
    user: {
      _id: "admin-id",
      email: "admin@example.com",
      role: "admin",
    },
  });

  assert.equal(session.user.username, "");
  assert.equal(session.user.role, "admin");
});

test("maps each role to a safe existing destination", () => {
  assert.equal(getRoleRedirect("candidate"), "/");
  assert.equal(getRoleRedirect("recruiter"), "/recruiter/dashboard");
  assert.equal(getRoleRedirect("admin"), "/admin/dashboard");
  assert.equal(getRoleRedirect("unknown"), "/");
});
