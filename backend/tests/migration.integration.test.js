import { spawnSync } from "child_process";
import mongoose from "mongoose";
import User from "../models/User.js";

describe("legacy migration", () => {
  test("dry-run is read-only and execute performs safe deterministic updates", async () => {
    const owner = await User.create({
      username: "Legacy Owner",
      email: "owner@example.com",
      password: "owner-password",
      role: "admin",
    });

    const users = mongoose.connection.collection("users");
    const jobs = mongoose.connection.collection("jobs");
    const applications = mongoose.connection.collection("applications");

    const legacyUserId = new mongoose.Types.ObjectId();
    const legacyJobId = new mongoose.Types.ObjectId();
    const legacyApplicationId = new mongoose.Types.ObjectId();
    const appliedAt = new Date("2024-06-01T00:00:00.000Z");

    await users.insertOne({
      _id: legacyUserId,
      username: "Legacy Candidate",
      email: " Legacy@Example.com ",
      password: "already-hashed-legacy-value",
      role: "user",
    });
    await jobs.insertOne({
      _id: legacyJobId,
      title: "Legacy Job",
      description: "<p>Legacy</p>",
      company: "Legacy Co",
      location: "Remote",
      applyLink: "https://example.com",
      category: "IT",
      experience: "Fresher",
      jobType: "Work from Home",
    });
    await applications.insertOne({
      _id: legacyApplicationId,
      jobId: legacyJobId,
      name: "Legacy Candidate",
      email: "legacy@example.com",
      appliedAt,
    });

    const runMigration = (execute) =>
      spawnSync(
        process.execPath,
        [
          "scripts/migrateLegacyData.js",
          execute ? "--execute" : "--dry-run",
        ],
        {
          cwd: process.cwd(),
          encoding: "utf8",
          env: {
            ...process.env,
            MIGRATION_MONGODB_URI: globalThis.__TEST_MONGO_URI__,
            LEGACY_JOB_OWNER_ID: owner._id.toString(),
          },
        }
      );

    const dryRun = runMigration(false);
    expect(dryRun.status).toBe(0);
    expect((await users.findOne({ _id: legacyUserId })).role).toBe("user");
    expect(await jobs.findOne({ _id: legacyJobId })).not.toHaveProperty(
      "createdBy"
    );

    const execution = runMigration(true);
    expect(execution.status).toBe(0);

    const [migratedUser, migratedJob, migratedApplication] = await Promise.all([
      users.findOne({ _id: legacyUserId }),
      jobs.findOne({ _id: legacyJobId }),
      applications.findOne({ _id: legacyApplicationId }),
    ]);

    expect(migratedUser.role).toBe("candidate");
    expect(migratedJob.createdBy.toString()).toBe(owner._id.toString());
    expect(migratedApplication.applicant.toString()).toBe(
      legacyUserId.toString()
    );
    expect(migratedApplication.status).toBe("Applied");
    expect(migratedApplication.createdAt.toISOString()).toBe(
      appliedAt.toISOString()
    );
  });
});
