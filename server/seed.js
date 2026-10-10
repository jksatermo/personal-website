import "dotenv/config";
import { connectDatabase, disconnectDatabase } from "./database.js";
import { seedPortfolio } from "./content.js";

try {
  await connectDatabase(process.env.MONGODB_URI);
  await seedPortfolio();
  console.log("Portfolio content synced from content/portfolio.json.");
} catch (error) {
  console.error(
    `Unable to seed portfolio (${error.name}). Check MONGODB_URI and content/portfolio.json.`,
  );
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
