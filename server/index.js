import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Database setup
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Admin users table
      db.run(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Wedding events table
      db.run(`
        CREATE TABLE IF NOT EXISTS wedding_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          event_name TEXT NOT NULL,
          event_date TEXT NOT NULL,
          event_time TEXT,
          location TEXT,
          description TEXT,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Vendors table
      db.run(`
        CREATE TABLE IF NOT EXISTS vendors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          contact_info TEXT,
          price_range TEXT,
          rating REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User vendor bookings
      db.run(`
        CREATE TABLE IF NOT EXISTS vendor_bookings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          vendor_id INTEGER NOT NULL,
          booking_date TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id),
          FOREIGN KEY (vendor_id) REFERENCES vendors (id)
        )
      `);

      // Contact messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'unread',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Vendor applications table
      db.run(`
        CREATE TABLE IF NOT EXISTS vendor_applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          category TEXT NOT NULL,
          business_name TEXT NOT NULL,
          description TEXT,
          experience_years INTEGER,
          portfolio_url TEXT,
          status TEXT DEFAULT 'pending',
          admin_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (!admin.role || admin.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = admin;
    next();
  });
};

// Routes

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Error creating user' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: this.lastID, email },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, name, email }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  console.log('Admin login attempt:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM admin_users WHERE email = ?', [email], async (err, admin) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!admin) {
      console.log('Admin user not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Admin user found:', admin.email);
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      console.log('Invalid password for admin:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Admin login successful:', email);
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  });
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Wedding events routes
app.post('/api/events', authenticateToken, (req, res) => {
  const { event_name, event_date, event_time, location, description } = req.body;
  
  if (!event_name || !event_date) {
    return res.status(400).json({ error: 'Event name and date are required' });
  }

  db.run(
    'INSERT INTO wedding_events (user_id, event_name, event_date, event_time, location, description) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.userId, event_name, event_date, event_time, location, description],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating event' });
      }
      res.status(201).json({
        message: 'Event created successfully',
        eventId: this.lastID
      });
    }
  );
});

app.get('/api/events', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM wedding_events WHERE user_id = ? ORDER BY event_date ASC',
    [req.user.userId],
    (err, events) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(events);
    }
  );
});

// Update event
app.put('/api/events/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { event_name, event_date, event_time, location, description } = req.body;
  
  if (!event_name || !event_date) {
    return res.status(400).json({ error: 'Event name and date are required' });
  }

  db.run(
    'UPDATE wedding_events SET event_name = ?, event_date = ?, event_time = ?, location = ?, description = ? WHERE id = ? AND user_id = ?',
    [event_name, event_date, event_time, location, description, id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating event' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event updated successfully' });
    }
  );
});

// Delete event
app.delete('/api/events/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM wedding_events WHERE id = ? AND user_id = ?',
    [id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error deleting event' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event deleted successfully' });
    }
  );
});

// Cancel event (mark as cancelled)
app.put('/api/events/:id/cancel', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'UPDATE wedding_events SET status = ? WHERE id = ? AND user_id = ?',
    ['cancelled', id, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error cancelling event' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json({ message: 'Event cancelled successfully' });
    }
  );
});

// Vendors routes
app.get('/api/vendors', (req, res) => {
  const { category } = req.query;
  let query = 'SELECT * FROM vendors';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  query += ' ORDER BY rating DESC';

  db.all(query, params, (err, vendors) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(vendors);
  });
});

// Vendor bookings
app.post('/api/bookings', authenticateToken, (req, res) => {
  const { vendor_id, booking_date, notes } = req.body;

  if (!vendor_id || !booking_date) {
    return res.status(400).json({ error: 'Vendor ID and booking date are required' });
  }

  db.run(
    'INSERT INTO vendor_bookings (user_id, vendor_id, booking_date, notes) VALUES (?, ?, ?, ?)',
    [req.user.userId, vendor_id, booking_date, notes],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Error creating booking' });
      }
      res.status(201).json({
        message: 'Booking created successfully',
        bookingId: this.lastID
      });
    }
  );
});

app.get('/api/bookings', authenticateToken, (req, res) => {
  db.all(
    `SELECT vb.*, v.name as vendor_name, v.category 
     FROM vendor_bookings vb 
     JOIN vendors v ON vb.vendor_id = v.id 
     WHERE vb.user_id = ? 
     ORDER BY vb.booking_date ASC`,
    [req.user.userId],
    (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(bookings);
    }
  );
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  db.run(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name, email, subject || '', message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        message: 'Message sent successfully! We\'ll get back to you soon.',
        messageId: this.lastID
      });
    }
  );
});

// Vendor application endpoint
app.post('/api/vendor-application', (req, res) => {
  const { 
    name, 
    email, 
    phone, 
    category, 
    business_name, 
    description, 
    experience_years, 
    portfolio_url 
  } = req.body;

  if (!name || !email || !category || !business_name) {
    return res.status(400).json({ error: 'Name, email, category, and business name are required' });
  }

  db.run(
    'INSERT INTO vendor_applications (name, email, phone, category, business_name, description, experience_years, portfolio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone || '', category, business_name, description || '', experience_years || 0, portfolio_url || ''],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        message: 'Vendor application submitted successfully! We\'ll review and get back to you soon.',
        applicationId: this.lastID
      });
    }
  );
});

// Admin routes
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
  // Get basic stats for admin dashboard
  Promise.all([
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM vendor_bookings', (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM vendors', (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM contact_messages WHERE status = "unread"', (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    }),
    new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM vendor_applications WHERE status = "pending"', (err, result) => {
        if (err) reject(err);
        else resolve(result.count);
      });
    })
  ])
  .then(([totalUsers, totalBookings, totalVendors, unreadMessages, pendingApplications]) => {
    res.json({
      totalUsers,
      totalBookings,
      totalVendors,
      unreadMessages,
      pendingApplications
    });
  })
  .catch(err => {
    res.status(500).json({ error: 'Database error' });
  });
});

app.get('/api/admin/bookings', authenticateAdmin, (req, res) => {
  db.all(
    `SELECT vb.*, v.name as vendor_name, v.category, u.name as user_name, u.email as user_email
     FROM vendor_bookings vb 
     JOIN vendors v ON vb.vendor_id = v.id 
     JOIN users u ON vb.user_id = u.id 
     ORDER BY vb.created_at DESC`,
    (err, bookings) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(bookings);
    }
  );
});

app.patch('/api/admin/bookings/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  db.run(
    'UPDATE vendor_bookings SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json({ message: 'Booking status updated successfully' });
    }
  );
});

app.get('/api/admin/vendors', authenticateAdmin, (req, res) => {
  db.all('SELECT * FROM vendors ORDER BY created_at DESC', (err, vendors) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(vendors);
  });
});

app.post('/api/admin/vendors', authenticateAdmin, (req, res) => {
  const { name, category, contact_info, price_range, rating } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  db.run(
    'INSERT INTO vendors (name, category, contact_info, price_range, rating) VALUES (?, ?, ?, ?, ?)',
    [name, category, contact_info || '', price_range || '', rating || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        message: 'Vendor created successfully',
        vendorId: this.lastID
      });
    }
  );
});

app.patch('/api/admin/vendors/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { name, category, contact_info, price_range, rating } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  db.run(
    'UPDATE vendors SET name = ?, category = ?, contact_info = ?, price_range = ?, rating = ? WHERE id = ?',
    [name, category, contact_info || '', price_range || '', rating || 0, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      res.json({ message: 'Vendor updated successfully' });
    }
  );
});

app.delete('/api/admin/vendors/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM vendors WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ message: 'Vendor deleted successfully' });
  });
});

app.get('/api/admin/messages', authenticateAdmin, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, messages) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(messages);
  });
});

app.patch('/api/admin/messages/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  db.run(
    'UPDATE contact_messages SET status = ? WHERE id = ?',
    [status, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json({ message: 'Message status updated successfully' });
    }
  );
});

// Vendor applications management
app.get('/api/admin/vendor-applications', authenticateAdmin, (req, res) => {
  db.all('SELECT * FROM vendor_applications ORDER BY created_at DESC', (err, applications) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(applications);
  });
});

app.patch('/api/admin/vendor-applications/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  db.run(
    'UPDATE vendor_applications SET status = ?, admin_notes = ? WHERE id = ?',
    [status, admin_notes || '', id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Application not found' });
      }
      res.json({ message: 'Application status updated successfully' });
    }
  );
});

app.post('/api/admin/vendor-applications/:id/approve', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { admin_notes } = req.body;

  // First, get the application details
  db.get('SELECT * FROM vendor_applications WHERE id = ?', [id], (err, application) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update application status
    db.run(
      'UPDATE vendor_applications SET status = ?, admin_notes = ? WHERE id = ?',
      ['approved', admin_notes || '', id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Create vendor from approved application
        db.run(
          'INSERT INTO vendors (name, category, contact_info, price_range, rating) VALUES (?, ?, ?, ?, ?)',
          [
            application.business_name,
            application.category,
            `Email: ${application.email}${application.phone ? `, Phone: ${application.phone}` : ''}`,
            'Contact for pricing',
            0
          ],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }
            res.json({ 
              message: 'Application approved and vendor created successfully',
              vendorId: this.lastID
            });
          }
        );
      }
    );
  });
});

// Initialize database and start server
initDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

export default app; 