import app from "./app.js";
import db from "./database/db.js";
import { seedDatabase } from "./database/seed.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3003;

// Initialize Database Schema if main.db was empty
function initSchema() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
    db.exec(schema);
    console.log('✓ Database schema initialized');
  } catch (error) {
    console.error('❌ Failed to initialize schema:', error.message);
  }
}

// Startup
try {
  console.log("Initializing Admin Backend...");
  initSchema();
  seedDatabase();
  
  app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`  G-TRASH Admin Panel Backend Server`);
    console.log(`  Running on: http://localhost:${PORT}`);
    console.log(`========================================\n`);
  });
} catch (error) {
  console.error("Startup error:", error);
  process.exit(1);
}

// Shutdown
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
