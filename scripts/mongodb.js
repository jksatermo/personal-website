import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server";

export const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

// The downloaded binary retains the library's checksum verification.
// Keep caches inside the checkout so restricted cloud environments can write them.
export async function startLocalMongo({ persistent = false } = {}) {
  const downloadDir = path.join(repositoryRoot, ".cache", "mongodb-binaries");
  const dbPath = path.join(repositoryRoot, ".data", "mongodb");
  const dockerBinary = path.join(
    repositoryRoot,
    ".cache",
    "mongodb-docker",
    "mongod",
  );
  await mkdir(downloadDir, { recursive: true });
  if (persistent) await mkdir(dbPath, { recursive: true });

  return MongoMemoryServer.create({
    binary: {
      version: "8.2.6",
      downloadDir,
      checkMD5: true,
      ...(existsSync(dockerBinary) ? { systemBinary: dockerBinary } : {}),
    },
    instance: {
      storageEngine: "wiredTiger",
      dbName: "personal_website",
      ...(persistent ? { dbPath } : {}),
    },
  });
}
