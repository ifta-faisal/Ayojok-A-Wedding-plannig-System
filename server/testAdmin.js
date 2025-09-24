import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Test admin login
const testAdminLogin = async () => {
  try {
    console.log('Testing admin login...');
    
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    
    // Check if admin exists
    db.get('SELECT * FROM admin_users WHERE email = ?', [adminEmail], async (err, admin) => {
      if (err) {
        console.error('Error checking admin:', err);
        return;
      }
      
      if (!admin) {
        console.log('Admin user does not exist. Creating...');
        
        // Create admin user
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        db.run(
          'INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Administrator', adminEmail, hashedPassword, 'admin'],
          function(err) {
            if (err) {
              console.error('Error creating admin:', err);
            } else {
              console.log('Admin user created successfully!');
              console.log(`Email: ${adminEmail}`);
              console.log(`Password: ${adminPassword}`);
            }
            db.close();
          }
        );
      } else {
        console.log('Admin user exists!');
        console.log(`Email: ${admin.email}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Role: ${admin.role}`);
        
        // Test password
        const validPassword = await bcrypt.compare(adminPassword, admin.password);
        console.log(`Password valid: ${validPassword}`);
        
        db.close();
      }
    });
  } catch (error) {
    console.error('Error testing admin login:', error);
    db.close();
  }
};

testAdminLogin(); 