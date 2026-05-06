# ⚡ Quick Reference Card

## 🚀 Common Commands

```bash
# Start development server
npm run dev

# Database commands
npm run prisma:generate    # Generate Prisma Client
npm run db:migrate         # Run migrations
npm run db:seed            # Seed database
npm run db:studio          # Open Prisma Studio

# Build & Production
npm run build              # Build for production
npm start                  # Start production server

# Testing
npm test                   # Run tests
```

## 📁 Folder Structure Quick Guide

```
src/
├── config/          # Environment, CORS, Database
├── middleware/      # Auth, Authorize, Validate, ErrorHandler
├── modules/         # Your features (auth, startups, etc.)
│   └── feature/
│       ├── feature.controller.ts   # HTTP handlers
│       ├── feature.service.ts      # Business logic
│       ├── feature.routes.ts       # API endpoints
│       ├── feature.validation.ts   # Zod schemas
│       └── feature.types.ts        # TypeScript types
├── shared/          # Utils, Constants, Errors
├── app.ts           # Express setup
├── server.ts        # Server start
└── routes.ts        # Main router
```

## 🔐 Authentication Flow

```typescript
// 1. Register
POST /api/auth/register
Body: { email, password, role }

// 2. Login
POST /api/auth/login
Body: { email, password }
Response: { token, refreshToken, user }

// 3. Use token in requests
Headers: { Authorization: "Bearer <token>" }

// 4. Protected route
GET /api/startups/my-profile
Headers: { Authorization: "Bearer <token>" }
```

## 🎯 Module Pattern

```typescript
// controller.ts - Handle HTTP
export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await itemService.create(data);
    return successResponse(res, result, 'Created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// service.ts - Business logic
export const create = async (data: CreateItemData) => {
  return prisma.item.create({ data });
};

// routes.ts - Define endpoints
router.post('/', authenticate, authorize([UserRole.ADMIN]), validate(createSchema), createItem);

// validation.ts - Zod schema
export const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
  }),
});
```

## 🛡️ Middleware Usage

```typescript
// Authentication (verify JWT)
router.get('/profile', authenticate, getProfile);

// Authorization (check role)
router.post('/admin', authenticate, authorize([UserRole.ADMIN]), adminAction);

// Validation (check input)
router.post('/create', authenticate, validate(createSchema), createItem);

// All together
router.post(
  '/startups',
  authenticate,                          // Must be logged in
  authorize([UserRole.STARTUP]),         // Must be startup user
  validate(createStartupSchema),         // Must have valid data
  createStartup                          // Execute handler
);
```

## 📝 Response Formats

```typescript
// Success
successResponse(res, data, 'Success message', 200);
// Returns: { success: true, message: '...', data: {...} }

// Error
errorResponse(res, 'Error message', 400);
// Returns: { success: false, message: '...' }

// Paginated
paginatedResponse(res, data, page, limit, total, 'Success');
// Returns: { success: true, data: [...], pagination: {...} }
```

## 🗄️ Prisma Queries

```typescript
// Find one
const user = await prisma.user.findUnique({ where: { id } });

// Find many
const users = await prisma.user.findMany({ where: { role: 'STARTUP' } });

// Create
const user = await prisma.user.create({ data: { email, passwordHash, role } });

// Update
const user = await prisma.user.update({ where: { id }, data: { email } });

// Delete
await prisma.user.delete({ where: { id } });

// With relations
const startup = await prisma.startup.findUnique({
  where: { id },
  include: { user: true, applications: true },
});

// Pagination
const startups = await prisma.startup.findMany({
  skip: (page - 1) * limit,
  take: limit,
  where: { isApproved: true },
});
```

## 🎨 TypeScript Patterns

```typescript
// Interface
interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
}

// Request with body
const handler = async (
  req: Request<{}, {}, CreateUserData>,
  res: Response
) => {
  const { email, password, role } = req.body;
};

// Request with params
const handler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const { id } = req.params;
};

// Request with query
const handler = async (
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response
) => {
  const { search } = req.query;
};
```

## 🚨 Error Handling

```typescript
// Throw custom errors
throw new BadRequestError('Invalid input');
throw new UnauthorizedError('Not authenticated');
throw new ForbiddenError('No permission');
throw new NotFoundError('Resource not found');
throw new ConflictError('Already exists');

// In try-catch
try {
  // Your code
} catch (error) {
  next(error);  // Pass to error handler
}
```

## 🧪 Testing Endpoints

```bash
# Health check
GET http://localhost:5000/health

# Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "Test@123",
  "role": "STARTUP"
}

# Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json
{
  "email": "test@example.com",
  "password": "Test@123"
}

# Protected route
GET http://localhost:5000/api/startups/my-profile
Authorization: Bearer <your-token>
```

## 🔑 Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=min-32-characters
JWT_REFRESH_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
```

## 📊 User Roles

```typescript
enum UserRole {
  STARTUP = 'STARTUP',      // Create profile, apply to programs
  INVESTOR = 'INVESTOR',    // Create profile, search startups
  REVIEWER = 'REVIEWER',    // Evaluate applications
  ADMIN = 'ADMIN',          // Manage everything
}
```

## 🔄 Git Workflow

```bash
# Start new feature
git checkout -b feature/my-feature

# Check status
git status

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Update from main
git checkout main
git pull origin main
git checkout feature/my-feature
git merge main
```

## 📞 Need Help?

1. Check this reference
2. Check SETUP.md
3. Check TASK_DISTRIBUTION.md
4. Ask in team chat
5. Schedule a call

---

**Keep this handy! 📌**
