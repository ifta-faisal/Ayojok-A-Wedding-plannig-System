import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'server', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Ensure admin user exists
const ensureAdmin = async () => {
  return new Promise((resolve, reject) => {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrator';
    
    db.get('SELECT * FROM admin_users WHERE email = ?', [adminEmail], async (err, admin) => {
      if (err) {
        console.error('Error checking admin:', err);
        reject(err);
        return;
      }
      
      if (!admin) {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        db.run(
          'INSERT INTO admin_users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [adminName, adminEmail, hashedPassword, 'admin'],
          function(err) {
            if (err) {
              console.error('Error creating admin:', err);
              reject(err);
            } else {
              console.log('✅ Admin user created successfully!');
              console.log(`📧 Email: ${adminEmail}`);
              console.log(`🔑 Password: ${adminPassword}`);
              resolve();
            }
          }
        );
      } else {
        console.log('✅ Admin user already exists!');
        const validPassword = await bcrypt.compare(adminPassword, admin.password);
        if (!validPassword) {
          console.log('⚠️ Updating admin password...');
          const hashedPassword = await bcrypt.hash(adminPassword, 10);
          db.run(
            'UPDATE admin_users SET password = ? WHERE email = ?',
            [hashedPassword, adminEmail],
            function(err) {
              if (err) {
                console.error('Error updating password:', err);
                reject(err);
              } else {
                console.log('✅ Admin password updated!');
                resolve();
              }
            }
          );
        } else {
          console.log('✅ Admin password is valid');
          resolve();
        }
      }
    });
  });
};

// Start the server
const startServer = () => {
  console.log('🚀 Starting server...');
  const server = spawn('node', ['server/index.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error);
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  return server;
};

// Main startup function
const startProject = async () => {
  try {
    console.log('🔧 Initializing project...');
    
    // Ensure admin user exists
    await ensureAdmin();
    
    // Start server
    const server = startServer();
    
    console.log('\n🎉 Project is ready!');
    console.log('📊 Admin Panel: http://localhost:5173/#admin');
    console.log('🔑 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend API: http://localhost:5000');
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down...');
      server.kill('SIGINT');
      db.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start project:', error);
    db.close();
    process.exit(1);
  }
};

startProject(); 