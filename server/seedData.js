import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const sampleVendors = [
  {
    name: 'Elegant Events Photography',
    category: 'Photography',
    contact_info: 'contact@elegantevents.com | (555) 123-4567',
    price_range: '$2000-$5000',
    rating: 4.8
  },
  {
    name: 'Dream Wedding Venues',
    category: 'Venue',
    contact_info: 'info@dreamvenues.com | (555) 234-5678',
    price_range: '$5000-$15000',
    rating: 4.9
  },
  {
    name: 'Blissful Blooms Florist',
    category: 'Florist',
    contact_info: 'hello@blissfulblooms.com | (555) 345-6789',
    price_range: '$800-$2500',
    rating: 4.7
  },
  {
    name: 'Harmony Wedding Band',
    category: 'Entertainment',
    contact_info: 'book@harmonyband.com | (555) 456-7890',
    price_range: '$1500-$4000',
    rating: 4.6
  },
  {
    name: 'Culinary Delights Catering',
    category: 'Catering',
    contact_info: 'events@culinarydelights.com | (555) 567-8901',
    price_range: '$50-$150 per person',
    rating: 4.8
  },
  {
    name: 'Perfect Match DJ Services',
    category: 'Entertainment',
    contact_info: 'dj@perfectmatch.com | (555) 678-9012',
    price_range: '$800-$2000',
    rating: 4.5
  },
  {
    name: 'Timeless Beauty Salon',
    category: 'Beauty',
    contact_info: 'beauty@timeless.com | (555) 789-0123',
    price_range: '$300-$800',
    rating: 4.7
  },
  {
    name: 'Luxury Limo Service',
    category: 'Transportation',
    contact_info: 'rides@luxurylimo.com | (555) 890-1234',
    price_range: '$200-$500',
    rating: 4.4
  }
];

const seedVendors = () => {
  return new Promise((resolve, reject) => {
    // First, check if vendors already exist
    db.get('SELECT COUNT(*) as count FROM vendors', (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('Vendors already exist in database, skipping seed');
        resolve();
        return;
      }

      console.log('Seeding vendors...');
      
      const stmt = db.prepare(
        'INSERT INTO vendors (name, category, contact_info, price_range, rating) VALUES (?, ?, ?, ?, ?)'
      );

      sampleVendors.forEach(vendor => {
        stmt.run([vendor.name, vendor.category, vendor.contact_info, vendor.price_range, vendor.rating]);
      });

      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Vendors seeded successfully!');
          resolve();
        }
      });
    });
  });
};

// Run the seeding
seedVendors()
  .then(() => {
    console.log('Database seeding completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  }); 