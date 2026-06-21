import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: "./.env" });

const execute = process.argv.includes("--execute");
const mode = execute ? "EXECUTE" : "DRY_RUN";
const legacyOwnerId = process.env.LEGACY_JOB_OWNER_ID?.trim();

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const buildConnectionUri = () => {
  if (process.env.MIGRATION_MONGODB_URI) {
    return process.env.MIGRATION_MONGODB_URI;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI or MIGRATION_MONGODB_URI is required");
  }
  return `${process.env.MONGODB_URI.replace(/\/$/, "")}/${DB_NAME}`;
};

const log = (event, details = {}) => {
  console.log(JSON.stringify({ event, mode, ...details }));
};

const run = async () => {
  log("migration_started");
  await mongoose.connect(buildConnectionUri(), { autoIndex: false });

  // Raw collections are intentional: current schemas reject legacy values
  // such as role="user" and missing required relationship fields.
  const users = mongoose.connection.collection("users");
  const jobs = mongoose.connection.collection("jobs");
  const applications = mongoose.connection.collection("applications");

  const legacyUsers = await users
    .find({ role: "user" }, { projection: { _id: 1, email: 1 } })
    .toArray();
  const legacyJobs = await jobs
    .find(
      { $or: [{ createdBy: { $exists: false } }, { createdBy: null }] },
      { projection: { _id: 1, title: 1 } }
    )
    .toArray();
  const legacyApplications = await applications
    .find({
      $or: [
        { applicant: { $exists: false } },
        { applicant: null },
        { status: { $exists: false } },
        { status: null },
        { createdAt: { $exists: false } },
        { createdAt: null },
      ],
    })
    .toArray();

  log("legacy_records_discovered", {
    users: legacyUsers.length,
    jobs: legacyJobs.length,
    applications: legacyApplications.length,
  });

  let ownerObjectId = null;
  if (legacyJobs.length > 0) {
    if (!legacyOwnerId || !mongoose.isValidObjectId(legacyOwnerId)) {
      throw new Error(
        "LEGACY_JOB_OWNER_ID must be a valid User ObjectId when legacy jobs exist"
      );
    }

    ownerObjectId = new mongoose.Types.ObjectId(legacyOwnerId);
    const owner = await users.findOne(
      { _id: ownerObjectId },
      { projection: { role: 1, email: 1 } }
    );
    if (!owner || !["admin", "recruiter"].includes(owner.role)) {
      throw new Error(
        "LEGACY_JOB_OWNER_ID must reference an existing admin or recruiter"
      );
    }
    log("legacy_job_owner_validated", {
      ownerId: ownerObjectId.toString(),
      ownerRole: owner.role,
    });
  }

  // Arrays are retained in this map so duplicate/case-variant user emails are
  // reported instead of selecting an arbitrary account.
  const emailToUsers = new Map();
  const allUsers = await users
    .find({}, { projection: { _id: 1, email: 1 } })
    .toArray();
  for (const user of allUsers) {
    const email = normalizeEmail(user.email);
    if (!email) continue;
    const matches = emailToUsers.get(email) || [];
    matches.push(user._id);
    emailToUsers.set(email, matches);
  }

  const duplicateEmails = [...emailToUsers.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([email, ids]) => ({
      email,
      userIds: ids.map((id) => id.toString()),
    }));
  duplicateEmails.forEach((duplicate) =>
    log("ambiguous_user_email", duplicate)
  );

  const applicationOperations = [];
  let linkedApplications = 0;
  let ambiguousApplications = 0;
  let unmatchedApplications = 0;

  for (const application of legacyApplications) {
    const set = {};

    if (!application.status) {
      set.status = "Applied";
    }
    if (!application.createdAt && application.appliedAt) {
      set.createdAt = application.appliedAt;
    }

    if (!application.applicant) {
      const normalizedEmail = normalizeEmail(application.email);
      const matches = emailToUsers.get(normalizedEmail) || [];

      if (matches.length === 1) {
        set.applicant = matches[0];
        linkedApplications += 1;
      } else if (matches.length > 1) {
        ambiguousApplications += 1;
        log("application_email_ambiguous", {
          applicationId: application._id.toString(),
          email: normalizedEmail,
          matchingUserIds: matches.map((id) => id.toString()),
        });
      } else {
        unmatchedApplications += 1;
        log("application_email_unmatched", {
          applicationId: application._id.toString(),
          email: normalizedEmail || null,
        });
      }
    }

    if (Object.keys(set).length > 0) {
      applicationOperations.push({
        updateOne: { filter: { _id: application._id }, update: { $set: set } },
      });
    }
  }

  log("migration_plan", {
    usersToNormalize: legacyUsers.length,
    jobsToAssign: legacyJobs.length,
    applicationsToUpdate: applicationOperations.length,
    applicationsLinked: linkedApplications,
    applicationsAmbiguous: ambiguousApplications,
    applicationsUnmatched: unmatchedApplications,
    duplicateNormalizedEmails: duplicateEmails.length,
  });

  if (execute) {
    // Every write is idempotent, so rerunning targets only records that still
    // have legacy values or missing fields.
    const userResult = await users.updateMany(
      { role: "user" },
      { $set: { role: "candidate" } }
    );
    const jobResult =
      legacyJobs.length > 0
        ? await jobs.updateMany(
            { $or: [{ createdBy: { $exists: false } }, { createdBy: null }] },
            { $set: { createdBy: ownerObjectId } }
          )
        : { modifiedCount: 0 };
    const applicationResult =
      applicationOperations.length > 0
        ? await applications.bulkWrite(applicationOperations, {
            ordered: false,
          })
        : { modifiedCount: 0 };

    log("migration_applied", {
      usersModified: userResult.modifiedCount,
      jobsModified: jobResult.modifiedCount,
      applicationsModified: applicationResult.modifiedCount,
    });
  } else {
    log("dry_run_complete", {
      nextCommand: "npm run migrate:legacy:execute",
    });
  }
};

run()
  .catch((error) => {
    console.error(
      JSON.stringify({
        event: "migration_failed",
        mode,
        message: error.message,
      })
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
