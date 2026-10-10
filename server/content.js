import portfolio from "../content/portfolio.json" with { type: "json" };
import { Portfolio } from "./models/Portfolio.js";

// This editable file is the source of truth; seeding is safe to run repeatedly.
// Importing it also makes Node's development watcher restart after content edits.
export async function seedPortfolio() {
  const document = new Portfolio({ ...portfolio, _id: "main" });
  await document.validate();
  await Portfolio.replaceOne({ _id: "main" }, document.toObject(), {
    upsert: true,
    runValidators: true,
  });
}
