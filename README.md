# Innobiz-K Ethiopia Platform

Government platform connecting Ethiopian startups with investors.  
**Ministry of Innovation and Technology (MInT)**

## Overview

Full-stack application for managing Ethiopia's startup ecosystem, built with Next.js (frontend) and Express.js (backend). Features role-based dashboards, application management, evaluation workflows, and analytics.

**Status**: Production Ready | **Architecture**: Unified Next.js App + Express API

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + Custom components
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: Zod

## Project Structure

```
innobiz-k-ethiopia-platform/
├── client/                          # Next.js frontend application
│   ├── app/
│   │   ├── (public)/               # Public routes
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── login/             # Login page
│   │   │   └── signup/            # Signup page
│   │   └── (dashboard)/           # Protected dashboard routes
│   │       └── dashboard/
│   │           ├── startup/       # Startup dashboard
│   │           ├── investor/      # Investor dashboard
│   │           ├── reviewer/      # Reviewer dashboard
│   │           ├── staff/         # Staff Admin dashboard
│   │           └── system-admin/  # System Admin dashboard
│   ├── components/                # Reusable components
│   ├── lib/                       # API client & utilities
│   └── public/                    # Static assets
│
├── server/                         # Express.js backend API
│   ├── src/
│   │   ├── modules/               # Feature modules (9 modules)
│   │   ├── middleware/            # Auth, validation, errors
│   │   ├── config/                # Configuration
│   │   └── shared/                # Utilities & types
│   ├── prisma/                    # Database schema & migrations
│   └── tests/                     # Backend tests
│
└── docs/                          # Documentation
```

## User Roles & Dashboards

### 1. Startup (`/dashboard/startup`)
- Dashboard overview with application stats
- Profile management
- Application submission & tracking
- Program browsing
- Settings

### 2. Investor (`/dashboard/investor`)
- Dashboard overview with investment metrics
- Discover startups
- Matches & recommendations
- Program participation
- Profile & settings

### 3. Reviewer (`/dashboard/reviewer`)
- Dashboard overview with assignment stats
- Assigned submissions
- Evaluation scoring
- Conflict management
- Help & settings

### 4. Staff Admin (`/dashboard/staff`)
- Dashboard overview with system stats
- Program management (create, update, delete programs)
- Application review & approval
- Reviewer assignment to applications
- Profile approval (startups & investors)
- **Reports & analytics** (charts)
- Settings
- **Note**: Cannot create, update, or delete users

### 5. System Admin (`/dashboard/system-admin`)
- Dashboard overview with system health
- **User management** (create, update, delete users)
- Server monitoring
- Database management
- Security controls
- Settings
- **Note**: Full system-level access including user account management

## Admin Role Separation

The platform implements a clear separation between system administration and business operations:

### System Admin (SYSTEM_ADMIN)
**Responsibilities**: System-level management and user account control
- Create, update, and delete user accounts (all roles)
- Manage system configuration
- Monitor server health and performance
- Database administration
- Security and access control

### Staff Admin (STAFF_ADMIN)
**Responsibilities**: Business operations and program management
- Create, update, and delete programs
- Approve/reject startup and investor profiles
- Review and approve/reject applications
- Assign reviewers to applications
- View business analytics and reports
- **Cannot** create, update, or delete user accounts

This separation ensures:
- Clear role boundaries and responsibilities
- Enhanced security by limiting user management access
- Focused workflows for each administrative role
- Audit trail for sensitive operations

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd innobiz-k-ethiopia-platform
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Setup environment variables**

**Server** (`server/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/innobiz"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional - for notifications)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

**Note**: Email notifications are optional. The system will work without them, but users won't receive automated emails for profile approvals, application updates, etc.

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

4. **Setup database**
```bash
cd server

# Run migrations
npx prisma migrate dev

# Seed initial data
npm run db:seed
```

5. **Start development servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Default Test Accounts

After running the seed script:

| Role | Email | Password |
|------|-------|----------|
| Staff Admin | staff.admin@innobiz.et | StaffAdmin@123 |
| System Admin | system.admin@innobiz.et | SystemAdmin@123 |
| Reviewer | reviewer@innobiz.et | Reviewer@123 |

## Development Scripts

### Root Level
```bash
npm run dev:server      # Start backend only
npm run dev:client      # Start frontend only
npm run dev:all         # Start both (concurrently)
```

### Backend (`server/`)
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio
npm test                # Run tests
```

### Frontend (`client/`)
```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
```

## API Endpoints

**Base URL**: `http://localhost:5000/api`

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login
POST   /api/auth/refresh           # Refresh access token
GET    /api/auth/me                # Get current user
PATCH  /api/auth/change-password   # Change password
```

### Startups
```
POST   /api/startups               # Create startup profile
GET    /api/startups/me            # Get my profile
PATCH  /api/startups/me            # Update my profile
GET    /api/startups               # List all startups (admin)
GET    /api/startups/:id           # Get startup by ID
PATCH  /api/startups/:id/approve   # Approve startup (admin)
PATCH  /api/startups/:id/reject    # Reject startup (admin)
```

### Investors
```
POST   /api/investors              # Create investor profile
GET    /api/investors/me           # Get my profile
PATCH  /api/investors/me           # Update my profile
GET    /api/investors              # List all investors (admin)
GET    /api/investors/:id          # Get investor by ID
PATCH  /api/investors/:id/approve  # Approve investor (admin)
PATCH  /api/investors/:id/reject   # Reject investor (admin)
```

### Programs
```
POST   /api/programs               # Create program (admin)
GET    /api/programs               # List programs
GET    /api/programs/:id           # Get program by ID
PATCH  /api/programs/:id           # Update program (admin)
DELETE /api/programs/:id           # Delete program (admin)
PATCH  /api/programs/:id/close     # Close program (admin)
```

### Applications
```
POST   /api/applications           # Create application
GET    /api/applications/my        # Get my applications
GET    /api/applications/:id       # Get application by ID
PATCH  /api/applications/:id       # Update application
PATCH  /api/applications/:id/submit # Submit application
DELETE /api/applications/:id       # Delete application
GET    /api/applications           # List all (admin)
PATCH  /api/applications/:id/approve # Approve (admin)
PATCH  /api/applications/:id/reject  # Reject (admin)
```

### Evaluations
```
POST   /api/evaluations/:applicationId  # Create evaluation
GET    /api/evaluations/my-assignments  # Get my assignments
GET    /api/evaluations/application/:id # Get evaluations for app
PATCH  /api/evaluations/:id            # Update evaluation
DELETE /api/evaluations/:id            # Delete evaluation
```

### Dashboards
```
GET    /api/dashboard/startup       # Startup dashboard data
GET    /api/dashboard/investor      # Investor dashboard data
GET    /api/dashboard/reviewer      # Reviewer dashboard data
GET    /api/dashboard/staff-admin   # Staff admin dashboard data
GET    /api/dashboard/system-admin  # System admin dashboard data
```

### Admin
```
POST   /api/admin/users             # Create user (SYSTEM_ADMIN only)
GET    /api/admin/users             # List users (SYSTEM_ADMIN only)
PATCH  /api/admin/users/:id         # Update user (SYSTEM_ADMIN only)
DELETE /api/admin/users/:id         # Delete user (SYSTEM_ADMIN only)
POST   /api/admin/assign-reviewers  # Assign reviewers (STAFF_ADMIN only)
GET    /api/admin/reviewer-assignments # Get assignments (STAFF_ADMIN only)
```

### Directory (Public)
```
GET    /api/directory/startups      # Public startup directory
GET    /api/directory/startups/:id  # Public startup profile
GET    /api/directory/investors     # Public investor directory
GET    /api/directory/investors/:id # Public investor profile
```

See `POSTMAN_COLLECTION.json` for detailed API documentation.

## Authentication

Include JWT token in request headers:

```javascript
headers: {
  'Authorization': 'Bearer <access_token>',
  'Content-Type': 'application/json'
}
```

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)
- Session management

### Email Notifications
The platform includes automated email notifications powered by Resend for key events:

**Startup Notifications:**
- Welcome email upon registration
- Profile approval/rejection notifications
- Application submission confirmation
- Application status updates (under review, approved, rejected)

**Investor Notifications:**
- Welcome email upon registration
- Profile approval/rejection notifications

**Reviewer Notifications:**
- Welcome email with temporary password
- New review assignment notifications

**Configuration:**
To enable email notifications, configure the following environment variables in `server/.env`:
```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
```

**Note**: In Resend test mode, emails can only be sent to verified email addresses. For production, verify your domain at resend.com/domains.

### Startup Features
- Profile creation & management
- Program discovery & application
- Application tracking
- Document management
- Email notifications for all profile and application events

### Investor Features
- Startup discovery
- Investment matching
- Program participation
- Portfolio management
- Email notifications for profile status

### Admin Features
- User management (SYSTEM_ADMIN only)
- Program creation & management
- Application review & approval
- Reviewer assignment
- Analytics & reporting (charts)
- System monitoring

### Security
- Helmet.js security headers
- CORS configuration
- Rate limiting
- Input validation (Zod)
- SQL injection prevention (Prisma)
- XSS protection

## Database Schema

PostgreSQL with Prisma ORM. Main entities:

- **Users** - 5 roles (STARTUP, INVESTOR, REVIEWER, STAFF_ADMIN, SYSTEM_ADMIN)
- **Startup Profiles** - Company information, sectors, stages
- **Investor Profiles** - Investment preferences, capacity
- **Programs** - 7 types (Accelerator, Incubator, Funding, etc.)
- **Applications** - Startup applications to programs
- **Evaluations** - Reviewer assessments
- **Profile History** - Audit trail for changes

## Testing

Run backend tests:
```bash
cd server
npm test
```

## Deployment

### Production Build

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start
```

### Environment Variables

Ensure all production environment variables are set:
- Database connection string
- JWT secrets (strong, random)
- API URLs
- CORS origins
- Email configuration (RESEND_API_KEY, EMAIL_FROM) for notifications

### Email Service Setup

For production email notifications:
1. Sign up at [Resend](https://resend.com)
2. Verify your domain
3. Generate an API key
4. Add to environment variables:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   EMAIL_FROM=noreply@yourdomain.com
   ```

Without email configuration, the system will log warnings but continue to function normally.

## Documentation

- `POSTMAN_COLLECTION.json` - API collection for testing
- `EVALUATIONS_TEST_GUIDE.md` - Evaluation workflow testing
- `SECURITY_SCALABILITY_AUDIT.md` - Security audit
- `PRODUCTION_READINESS_AUDIT.md` - Production checklist
- `docs/innobiz-k-srs.txt` - Software Requirements Specification

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

Ministry of Innovation and Technology (MInT), Ethiopia - 2026

## Support

For issues and questions, please contact the development team.
