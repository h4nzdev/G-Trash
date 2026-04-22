import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the shared main database at project root
const dbPath = path.join(__dirname, '../../../main.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create empty database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  console.warn('⚠️  Resident database not found. Creating empty database...');
  console.warn('   Please start the Resident backend to initialize the schema:');
  console.warn('   cd Resident/backend && npm start\n');
  fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath);

// Enable WAL mode for better performance and foreign keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
