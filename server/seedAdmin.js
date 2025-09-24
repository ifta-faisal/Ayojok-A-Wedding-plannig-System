import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const seedAdmin = async () => {
  try {
    console.log('Creating admin user...');
    
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';  // Change this to a secure password
    const adminName = 'Administrator';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    // Check if admin already exists
    db.get('SELECT id FROM admin_users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) {
        console.error('Error checking for existing admin:', err);
        return;
      }
      
      if (row) {
        console.log('Admin user already exists!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        db.close();
        return;
      }
      
      // Insert admin user
      db.run(
        'INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [adminName, adminEmail, hashedPassword, 'admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin user:', err);
          } else {
            console.log('Admin user created successfully!');
            console.log('=================================');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('=================================');
            console.log('IMPORTANT: Change the default password after first login!');
            console.log('You can access the admin panel at: http://localhost:5173/#admin');
          }
          db.close();
        }
      );
    });
  } catch (error) {
    console.error('Error seeding admin:', error);
    db.close();
  }
};

seedAdmin();