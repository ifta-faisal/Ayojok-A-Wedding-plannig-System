# Wedding Planning App with Database

A full-stack wedding planning application with user authentication, event management, vendor booking, and database integration.

## 🎯 Features

- **User Authentication**: Register, login, and profile management
- **Event Management**: Create and manage wedding events
- **Vendor Directory**: Browse and book wedding vendors
- **Booking System**: Manage vendor bookings
- **Admin Panel**: Complete admin dashboard with user, booking, and vendor management
- **Database Integration**: SQLite database with RESTful API
- **Modern UI**: Beautiful React interface with Tailwind CSS

## 🚀 Quick Start

### Option 1: One-Command Startup (Recommended)
```bash
npm run start
```

This will:
- ✅ Create admin user automatically
- ✅ Start the backend server
- ✅ Open the admin panel at http://localhost:5173/#admin

### Option 2: Manual Startup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the backend server**
   ```bash
   npm run server
   ```

3. **Start the frontend development server**
   ```bash
   npm run dev
   ```

4. **Create admin user**
   ```bash
   npm run seed-admin
   ```

## 🔑 Admin Access

- **URL**: http://localhost:5173/#admin
- **Email**: admin@example.com
- **Password**: admin123

## 🏗️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- bcrypt for password hashing
- CORS enabled

## 📊 Database Schema

The application uses SQLite with the following tables:

- **users**: User accounts and authentication
- **admin_users**: Admin accounts and authentication
- **wedding_events**: Wedding event management
- **vendors**: Vendor directory with categories
- **vendor_bookings**: User bookings for vendors

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile (requires auth)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/bookings` - Get all bookings
- `PATCH /api/admin/bookings/:id` - Update booking status
- `GET /api/admin/vendors` - Get all vendors
- `POST /api/admin/vendors` - Add new vendor
- `PATCH /api/admin/vendors/:id` - Update vendor
- `DELETE /api/admin/vendors/:id` - Delete vendor

### Events
- `POST /api/events` - Create wedding event (requires auth)
- `GET /api/events` - Get user's events (requires auth)
- `PUT /api/events/:id` - Update event (requires auth)
- `DELETE /api/events/:id` - Delete event (requires auth)

### Vendors
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors?category=Photography` - Get vendors by category

### Bookings
- `POST /api/bookings` - Create vendor booking (requires auth)
- `GET /api/bookings` - Get user's bookings (requires auth)

## 🛠️ Development

### Running Both Frontend and Backend

You can run both servers simultaneously:

1. **Terminal 1 - Backend**
   ```bash
   npm run dev:server
   ```

2. **Terminal 2 - Frontend**
   ```bash
   npm run dev
   ```

### Database Management

The SQLite database file (`server/database.sqlite`) is created automatically when you first start the server. You can:

- **Reset the database**: Delete `server/database.sqlite` and restart the server
- **Seed sample data**: Run `npm run seed` to populate vendors
- **View database**: Use any SQLite browser like DB Browser for SQLite

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## 🎨 Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Admin.tsx              # Admin panel component
│   │   ├── AdminLogin.tsx         # Admin login form
│   │   ├── AdminDashboard.tsx     # Admin dashboard
│   │   ├── AdminStats.tsx         # Admin statistics
│   │   ├── AdminBookings.tsx      # Admin bookings management
│   │   ├── AdminVendors.tsx       # Admin vendors management
│   │   ├── AdminMessages.tsx      # Admin messages management
│   │   ├── Dashboard.tsx          # User dashboard
│   │   ├── Header.tsx             # Navigation header
│   │   ├── Hero.tsx               # Landing page hero
│   │   ├── AuthModal.tsx          # Authentication modal
│   │   └── ...                    # Other components
│   ├── services/
│   │   └── api.ts                 # API service functions
│   ├── App.tsx                    # Main application component
│   └── main.tsx                   # Application entry point
├── server/
│   ├── index.js                   # Express server
│   ├── database.sqlite            # SQLite database
│   ├── seedAdmin.js               # Admin user creation script
│   └── ...                        # Other server files
├── package.json                   # Project dependencies
└── README.md                      # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL injection prevention

## 🚀 Production Deployment

For production deployment:

1. **Change JWT_SECRET** to a strong, unique secret
2. **Consider using PostgreSQL or MySQL** instead of SQLite
3. **Set up proper CORS configuration** for your domain
4. **Use environment variables** for all sensitive configuration
5. **Set up HTTPS** for secure communication

## 🐛 Troubleshooting

### Common Issues

1. **Admin login not working**
   - Ensure server is running on port 5000
   - Check if admin user exists: `npm run seed-admin`
   - Verify API base URL in `src/services/api.ts`

2. **Database errors**
   - Delete `server/database.sqlite` and restart server
   - Check database permissions

3. **CORS errors**
   - Ensure CORS is properly configured in `server/index.js`
   - Check if frontend is running on correct port

4. **Port conflicts**
   - Change port in `server/index.js` if 5000 is in use
   - Update `API_BASE_URL` in `src/services/api.ts`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: ayojok@gmail.com
- Phone: +8801303897972
- Address: Madani Ave 100ft, Badda, Dhaka Bangladesh 