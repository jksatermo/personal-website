import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import request from "supertest";
import { createApp } from "../app.js";
import { connectDatabase, disconnectDatabase } from "../database.js";
import { seedPortfolio } from "../content.js";
import { Portfolio } from "../models/Portfolio.js";
import { startLocalMongo } from "../../scripts/mongodb.js";
import source from "../../content/portfolio.json" with { type: "json" };

let mongo;
const app = createApp({ clientDirectory: null });

before(async () => {
  mongo = await startLocalMongo();
  await connectDatabase(mongo.getUri("portfolio_test"));
});

after(async () => {
  await disconnectDatabase();
  if (mongo) await mongo.stop();
});

test("health reports an active MongoDB connection", async () => {
  const response = await request(app).get("/api/health").expect(200);
  assert.deepEqual(response.body, { status: "ok", database: "connected" });
  assert.equal(response.headers["x-powered-by"], undefined);
});

test("missing content returns an explicit 404", async () => {
  await request(app)
    .get("/api/portfolio")
    .expect(404, { error: "Portfolio content has not been seeded." });
});

test("seeding is repeatable and the API returns editable content from MongoDB", async () => {
  await seedPortfolio();
  await seedPortfolio();
  assert.equal(await Portfolio.countDocuments(), 1);
  const response = await request(app).get("/api/portfolio").expect(200);
  assert.deepEqual(response.body, source);
  assert.equal(response.headers["cache-control"], "no-cache");
  assert.ok(!("_id" in response.body));

  await Portfolio.updateOne(
    { _id: "main" },
    { $set: { "profile.tagline": "A database-backed update." } },
  );
  const updated = await request(app).get("/api/portfolio").expect(200);
  assert.equal(updated.body.profile.tagline, "A database-backed update.");
});

test("unknown routes and write requests cannot modify public content", async () => {
  await request(app)
    .get("/api/unknown")
    .expect(404, { error: "API route not found." });
  await request(app)
    .post("/api/portfolio")
    .send({ profile: { name: "Changed" } })
    .expect(404);
  await request(app)
    .get("/not-a-page")
    .expect(404, { error: "Page not found." });
  assert.equal(
    (await Portfolio.findById("main")).profile.name,
    source.profile.name,
  );
});

test("project actions require a label and an HTTPS destination", async () => {
  for (const action of [
    { label: "Project page", url: "javascript:alert(1)" },
    { label: "Project page", url: null },
    { url: "https://example.com/project" },
  ]) {
    const invalid = structuredClone(source);
    invalid.projects[0].links = [action];
    await assert.rejects(new Portfolio(invalid).validate(), {
      name: "ValidationError",
    });
  }
});

test("database loss returns a safe 503 and health reflects the outage", async () => {
  await disconnectDatabase();
  await request(app)
    .get("/api/health")
    .expect(503, { status: "unavailable", database: "disconnected" });
  const response = await request(app).get("/api/portfolio").expect(503);
  assert.deepEqual(response.body, {
    error: "Portfolio is temporarily unavailable. Please try again shortly.",
  });
});
