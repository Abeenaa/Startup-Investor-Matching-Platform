# Innobiz-K Ethiopia Platform

Government platform connecting Ethiopian startups with investors.  
**Ministry of Innovation and Technology (MInT)**

## Overview

Backend API for startup-investor matching platform with role-based access control, application management, and evaluation workflow.

**Status**: Production Ready | **Modules**: 9/9 Complete | **Endpoints**: 54

## Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL (Supabase) + Prisma ORM
- JWT Authentication + RBAC
- Zod Validation

## User Roles

- **STARTUP** - Create profile, apply to programs
- **INVESTOR** - Create profile, search startups
- **REVIEWER** - Evaluate applications
- **STAFF_ADMIN** - Manage programs, approve profiles
- **SYSTEM_ADMIN** - Manage users and system

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run db:migrate

# Start server
npm run dev
```

Server runs at `http://localhost:5000`

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

**Base URL**: `http://localhost:5000/api`

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/me
PATCH  /api/auth/change-password
```

### Startups
```
POST   /api/startups/profile
GET    /api/startups/profile
PATCH  /api/startups/profile
GET    /api/startups
GET    /api/startups/:id
PATCH  /api/startups/:id/approve
PATCH  /api/startups/:id/reject
```

### Investors
```
POST   /api/investors/profile
GET    /api/investors/profile
PATCH  /api/investors/profile
GET    /api/investors
GET    /api/investors/:id
PATCH  /api/investors/:id/approve
```

### Admin
```
POST   /api/admin/users
GET    /api/admin/users
PATCH  /api/admin/users/:id
DELETE /api/admin/users/:id
POST   /api/admin/assign-reviewers
GET    /api/admin/reviewer-assignments
```

### Directory (Public)
```
GET    /api/directory/startups
GET    /api/directory/startups/:id
GET    /api/directory/investors
GET    /api/directory/investors/:id
```

### Programs
```
POST   /api/programs
GET    /api/programs
GET    /api/programs/:id
PATCH  /api/programs/:id
DELETE /api/programs/:id
POST   /api/programs/:id/close
```

### Applications
```
POST   /api/applications
GET    /api/applications/my-applications
GET    /api/applications/:id
PATCH  /api/applications/:id
POST   /api/applications/:id/submit
DELETE /api/applications/:id
GET    /api/applications
PATCH  /api/applications/:id/status
PATCH  /api/applications/:id/approve
PATCH  /api/applications/:id/reject
```

### Evaluations
```
POST   /api/evaluations
PATCH  /api/evaluations/:id
GET    /api/evaluations/my-assignments
GET    /api/evaluations/application/:id
GET    /api/evaluations/:id
DELETE /api/evaluations/:id
```

### Dashboards
```
GET    /api/dashboard/startup
GET    /api/dashboard/investor
GET    /api/dashboard/reviewer
GET    /api/dashboard/staff-admin
GET    /api/dashboard/system-admin
```

## Authentication

Include JWT token in request headers:

```javascript
headers: {
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json'
}
```

## Response Format

Success:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Security Features

- JWT authentication with refresh tokens
- Role-based access control
- Password hashing (bcrypt)
- Input validation (Zod)
- Rate limiting
- Security headers (Helmet)
- CORS configuration
- XSS protection
- SQL injection protection

## Database

PostgreSQL with Prisma ORM. Schema includes:
- Users (5 roles)
- Startup profiles
- Investor profiles
- Programs (7 types)
- Applications
- Evaluations
- Profile history (audit trail)

## Scripts

```bash
npm run dev              # Development server
npm run build            # Build for production
npm start                # Production server
npm run prisma:generate  # Generate Prisma client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Prisma Studio GUI
npm test                 # Run tests
```

## Project Structure

```
server/
├── prisma/              # Database schema & migrations
├── src/
│   ├── config/          # Configuration
│   ├── middleware/      # Auth, validation, errors
│   ├── modules/         # Feature modules
│   │   ├── auth/
│   │   ├── startups/
│   │   ├── investors/
│   │   ├── admin/
│   │   ├── directory/
│   │   ├── programs/
│   │   ├── applications/
│   │   ├── evaluations/
│   │   └── dashboard/
│   ├── shared/          # Utilities & types
│   ├── app.ts
│   ├── server.ts
│   └── routes.ts
└── tests/
```

## Documentation

- `PROJECT_STATUS.md` - Module completion status
- `PROGRAMS_APPLICATIONS_DESIGN.md` - Design specifications
- `POSTMAN_COLLECTION.json` - API collection for testing

## License

Ministry of Innovation and Technology (MInT), Ethiopia - 2026
