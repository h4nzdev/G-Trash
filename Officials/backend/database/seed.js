import db from './db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export function seedDatabase() {
  // Check if tables exist first
  try {
    const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
    if (!tableCheck) {
      console.warn('⚠️  Users table does not exist in the database.');
      console.warn('   Please start the Resident backend to initialize the schema:');
      console.warn('   cd Resident/backend && npm start\n');
      console.log('Skipping Officials seeding - database schema not initialized\n');
      return;
    }
  } catch (error) {
    console.warn('⚠️  Database access error:', error.message);
    console.warn('   Please start the Resident backend first.\n');
    return;
  }

  // Check if official users already exist
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users WHERE role IN ('admin', 'official', 'supervisor')").get();
  if (userCount.count > 0) {
    console.log(`✓ Officials data already exists (${userCount.count} users)`);
    return;
  }

  console.log('Seeding Officials data into shared database...\n');

  try {
    // Seed Officials users (admin and barangay officials)
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    // Get barangay IDs from database
    const barangays = db.prepare('SELECT id, name FROM barangays LIMIT 10').all();
    
    const users = [
      {
        id: uuidv4(),
        email: 'admin@gtrash.com',
        password_hash: hashedPassword,
        full_name: 'Admin User',
        phone: '09000000000',
        role: 'admin',
        barangay_id: null,
        household_members: 1,
        notifications_enabled: 1,
        collection_reminders: 1,
      },
      {
        id: uuidv4(),
        email: 'official@lahug.com',
        password_hash: hashedPassword,
        full_name: 'Barangay Captain - Lahug',
        phone: '09000000001',
        role: 'official',
        barangay_id: barangays.find(b => b.name.includes('Lahug'))?.id || null,
        household_members: 1,
        notifications_enabled: 1,
        collection_reminders: 1,
      },
      {
        id: uuidv4(),
        email: 'official@apas.com',
        password_hash: hashedPassword,
        full_name: 'Barangay Captain - Apas',
        phone: '09000000002',
        role: 'official',
        barangay_id: barangays.find(b => b.name.includes('Apas'))?.id || null,
        household_members: 1,
        notifications_enabled: 1,
        collection_reminders: 1,
      },
    ];

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (id, email, password_hash, full_name, phone, role, barangay_id, household_members, notifications_enabled, collection_reminders)
      VALUES (@id, @email, @password_hash, @full_name, @phone, @role, @barangay_id, @household_members, @notifications_enabled, @collection_reminders)
    `);

    const insertManyUsers = db.transaction((users) => {
      for (const user of users) {
        insertUser.run(user);
      }
    });

    insertManyUsers(users);
    console.log(`✓ Seeded ${users.length} Officials users`);

    console.log('\n✅ Officials seeding completed successfully!');
    console.log('\n📝 Demo Credentials (Officials):');
    console.log('   Admin: admin@gtrash.com / password123');
    console.log('   Official: official@lahug.com / password123\n');
    
  } catch (error) {
    console.error('❌ Error seeding Officials data:', error.message);
    console.error('Make sure the Resident backend has initialized the database first.');
  }
}
