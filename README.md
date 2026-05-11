# Innobiz-K Ethiopia: Startup-Investor Matching Platform

A platform connecting Ethiopian startups with investors, built for the Ministry of Innovation and Technology (MInT).

## Tech Stack

- Frontend: React.js + Tailwind CSS
- Backend: Node.js + Express.js + TypeScript
- Database: PostgreSQL (Supabase)
- Authentication: JWT with Role-Based Access Control
- ORM: Prisma
- Validation: Zod

## Features (Phase 1)

- User registration and authentication with role-based access
- Startup profile management with approval workflow
- Investor profile management
- Public startup directory with search and filtering
- Program and application management
- Evaluation and review workflow
- Admin dashboard

## User Roles

| Role | Description |
|------|-------------|
| STARTUP | Creates profile, applies to programs |
| INVESTOR | Creates profile, searches startups |
| REVIEWER | Evaluates applications |
| STAFF_ADMIN | Approves profiles, assigns reviewers, manages programs |
| SYSTEM_ADMIN | Manages users, roles, and system settings |

## Project Structure

```
innobiz-k-platform/
├── server/
│   ├── prisma/          # Database schema and migrations
│   ├── src/
│   │   ├── config/      # Environment, CORS, database setup
│   │   ├── middleware/  # Auth, authorization, validation, error handling
│   │   ├── modules/     # Feature modules (auth, startups, investors, etc.)
│   │   ├── shared/      # Utilities, constants, types, errors
│   │   ├── app.ts       # Express app configuration
│   │   ├── server.ts    # Server entry point
│   │   └── routes.ts    # Main router
│   └── tests/           # Unit and integration tests
└── client/              # Frontend (React + Tailwind)
```

## Getting Started

### Prerequisites
- Node.js v18+
- A Supabase project (for PostgreSQL database)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd innobiz-k-platform

# Install dependencies
npm install

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your Supabase credentials

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with initial data
npm run db:studio        # Open Prisma Studio
npm test                 # Run tests
```

## API Endpoints

### Auth
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET  /api/auth/me
PATCH /api/auth/change-password
```

### Startups
```
POST   /api/startups
GET    /api/startups/my-profile
GET    /api/startups/:id
PUT    /api/startups/:id
```

### Investors
```
POST   /api/investors
GET    /api/investors/my-profile
GET    /api/investors/:id
PUT    /api/investors/:id
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feature/your-feature`
5. Create a pull request

## License

Ministry of Innovation and Technology (MInT), Ethiopia - 2026
