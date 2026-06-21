import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server-core";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "integration-test-jwt-secret";
process.env.ACCESS_TOKEN_EXPIRY = "1h";
process.env.ADMIN_REGISTRATION_CODE = "integration-admin-code";
process.env.CORS_ORIGINS = "http://localhost:5173";

beforeAll(async () => {
  // The in-memory server isolates tests from local and production databases.
  globalThis.__MONGO_MEMORY_SERVER__ = await MongoMemoryServer.create();
  globalThis.__TEST_MONGO_URI__ =
    globalThis.__MONGO_MEMORY_SERVER__.getUri("opportunityx_integration");
  await mongoose.connect(globalThis.__TEST_MONGO_URI__);
});

beforeEach(async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await globalThis.__MONGO_MEMORY_SERVER__?.stop();
});
