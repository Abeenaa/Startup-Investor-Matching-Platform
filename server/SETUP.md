# Backend Setup Guide

## Prerequisites

Before you start, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase account)
- Git

## 1. Clone the Repository

```bash
git clone <repository-url>
cd innobiz-k-platform/server
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/innobiz_db
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
```

### Getting DATABASE_URL (Supabase):

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string" (URI format)
5. Replace `[YOUR-PASSWORD]` with your database password

## 4. Database Setup

Generate Prisma Client:

```bash
npm run prisma:generate
```

Run migrations to create tables:

```bash
npm run db:migrate
```

Seed the database with initial data (admin user):

```bash
npm run db:seed
```

## 5. Start Development Server

```bash
npm run dev
```

Server should start on http://localhost:5000

## 6. Test the Setup

Open your browser or Postman and visit:

```
http://localhost:5000/health
```

You should see:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-06T..."
}
```

## 7. Default Admin Credentials

After seeding, you can login with:

- Email: `admin@innobiz.et`
- Password: `Admin@123`

## 8. Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run prisma:generate  # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio (database GUI)

# Production
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run tests
```

## 9. Project Structure

```
server/
├── prisma/              # Database schema and migrations
├── src/
│   ├── config/         # Configuration files
│   ├── middleware/     # Express middleware
│   ├── modules/        # Feature modules (auth, startups, etc.)
│   ├── shared/         # Shared utilities and constants
│   ├── app.ts          # Express app setup
│   ├── server.ts       # Server entry point
│   └── routes.ts       # Main router
└── tests/              # Test files
```

## 10. Development Workflow

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test your changes:

   ```bash
   npm run dev
   ```

4. Commit and push:

   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request on GitHub

## Troubleshooting

### Database Connection Error

- Check if PostgreSQL is running
- Verify DATABASE_URL in .env
- Make sure database exists

### Port Already in Use

- Change PORT in .env to another port (e.g., 5001)

### Prisma Client Not Found

- Run `npm run prisma:generate`

### Module Not Found Errors

- Delete node_modules and package-lock.json
- Run `npm install` again

## Need Help?

Contact the team lead or check the main README.md
