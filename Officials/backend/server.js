import app from "./app.js";
import db from "./database/db.js";
import { seedDatabase } from "./database/seed.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3003;

// Seed Officials data into shared database
try {
  console.log("Checking shared database (Resident gtrash.db)...");
  seedDatabase();
  console.log("Officials data ready!\n");
} catch (error) {
  console.error("Database seeding error:", error);
  process.exit(1);
}

// Start server
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`  G-TRASH Officials Backend Server`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  API Base: http://localhost:${PORT}/api`);
  console.log(`========================================\n`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down gracefully...");
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down gracefully...");
  db.close();
  process.exit(0);
});
