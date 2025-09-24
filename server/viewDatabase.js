import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Database Viewer');
console.log('==================\n');

// Function to display table data
const showTableData = (tableName) => {
  return new Promise((resolve, reject) => {
    console.log(`📋 Table: ${tableName}`);
    console.log('─'.repeat(50));
    
    db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
      if (err) {
        console.error(`Error reading ${tableName}:`, err.message);
        resolve();
        return;
      }
      
      if (rows.length === 0) {
        console.log('   (No data)');
      } else {
        console.log(`   Found ${rows.length} records:`);
        rows.forEach((row, index) => {
          console.log(`   ${index + 1}.`, JSON.stringify(row, null, 2));
        });
      }
      console.log('');
      resolve();
    });
  });
};

// Main function to display all tables
const viewDatabase = async () => {
  try {
    // Get list of tables
    db.all("SELECT name FROM sqlite_master WHERE type='table'", async (err, tables) => {
      if (err) {
        console.error('Error getting tables:', err.message);
        return;
      }

      console.log(`📊 Database: ${dbPath}`);
      console.log(`📋 Total Tables: ${tables.length}\n`);

      // Display each table
      for (const table of tables) {
        await showTableData(table.name);
      }

      console.log('✅ Database viewing complete!');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error viewing database:', error);
    process.exit(1);
  }
};

// Run the viewer
viewDatabase(); 