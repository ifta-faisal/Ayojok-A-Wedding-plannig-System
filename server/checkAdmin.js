import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Check if admin user exists
db.get('SELECT * FROM admin_users WHERE email = ?', ['admin@example.com'], (err, admin) => {
  if (err) {
    console.error('Error checking admin:', err);
  } else if (admin) {
    console.log('Admin user exists:');
    console.log(`ID: ${admin.id}`);
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);
  } else {
    console.log('Admin user does not exist');
  }
  db.close();
}); 