import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Portfolio } from "./models/Portfolio.js";

const defaultClientDirectory = fileURLToPath(
  new URL("../client/dist/", import.meta.url),
);

export function createApp({ clientDirectory = defaultClientDirectory } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());

  app.get("/api/health", (_request, response) => {
    const connected = mongoose.connection.readyState === 1;
    response.status(connected ? 200 : 503).json({
      status: connected ? "ok" : "unavailable",
      database: connected ? "connected" : "disconnected",
    });
  });

  app.get("/api/portfolio", async (_request, response) => {
    const portfolio = await Portfolio.findById("main").lean();
    if (!portfolio) {
      return response
        .status(404)
        .json({ error: "Portfolio content has not been seeded." });
    }
    const { _id, ...content } = portfolio;
    response.set("Cache-Control", "no-cache");
    return response.json(content);
  });

  app.use("/api", (_request, response) => {
    response.status(404).json({ error: "API route not found." });
  });

  if (clientDirectory && existsSync(path.join(clientDirectory, "index.html"))) {
    app.use(express.static(clientDirectory, { index: "index.html" }));
  }

  app.use((_request, response) => {
    response.status(404).json({ error: "Page not found." });
  });

  app.use((error, _request, response, _next) => {
    // Do not leak database addresses, credentials, or stack traces to clients/logs.
    console.error(`Request failed: ${error.name || "Error"}`);
    response.status(503).json({
      error: "Portfolio is temporarily unavailable. Please try again shortly.",
    });
  });

  return app;
}
