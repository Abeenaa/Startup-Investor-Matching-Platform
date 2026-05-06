# 🤝 Contributing to Innobiz-K Platform

## Team Members

### Backend Team (3 Developers)
- Developer 1: Authentication & User Management
- Developer 2: Profiles & Directory
- Developer 3: Programs, Applications & Evaluations

### Frontend Team (2 Developers)
- Developer 4: UI Components & Layouts
- Developer 5: Pages & State Management

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innobiz-k-platform
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Edit .env with your values
   npm run prisma:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

3. **Frontend Setup** (when ready)
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Development Workflow

### 1. Pick a Task
- Check `server/TASK_DISTRIBUTION.md` for your assigned tasks
- Update the task status when you start

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming convention:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `test/` - Tests

### 3. Write Code
- Follow the existing folder structure
- Write clean, readable code
- Add comments for complex logic
- Handle errors properly

### 4. Test Your Code
- Test all endpoints with Postman/Thunder Client
- Make sure existing features still work
- Write unit tests if time permits

### 5. Commit Your Changes
```bash
git add .
git commit -m "feat: add user registration endpoint"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring

### 6. Push to GitHub
```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request
- Go to GitHub
- Click "New Pull Request"
- Add description of what you did
- Request review from team lead
- Wait for approval

### 8. Merge
- After approval, merge your PR
- Delete your feature branch
- Pull latest main branch

## Code Standards

### TypeScript
- Use TypeScript for all files
- Define interfaces for data structures
- Use proper types (avoid `any` when possible)

### File Organization
- One feature per module
- Keep files small and focused
- Follow the existing structure

### Naming Conventions
- Files: `kebab-case.ts`
- Functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Error Handling
```typescript
try {
  // Your code
} catch (error) {
  next(new AppError('Error message', 400));
}
```

### API Responses
```typescript
// Success
return successResponse(res, data, 'Success message', 200);

// Error
return errorResponse(res, 'Error message', 400);
```

## Communication

### Daily Standup (9:00 AM)
- What did you do yesterday?
- What will you do today?
- Any blockers?

### Code Review
- Review PRs within 24 hours
- Be constructive and helpful
- Ask questions if unclear

### Questions
- Use team chat for quick questions
- Schedule call for complex issues
- Document solutions

## Testing

### Manual Testing
- Test your endpoints with Postman
- Test edge cases
- Test error scenarios

### Automated Testing (if time permits)
```bash
npm test
```

## Common Issues

### Database Connection Error
```bash
# Check DATABASE_URL in .env
# Make sure PostgreSQL is running
npm run db:migrate
```

### Prisma Client Not Found
```bash
npm run prisma:generate
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=5001
```

## Resources

- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev/)

## Need Help?

- Check documentation first
- Ask in team chat
- Contact team lead
- Schedule a call if needed

---

**Let's build something great together! 🚀**
