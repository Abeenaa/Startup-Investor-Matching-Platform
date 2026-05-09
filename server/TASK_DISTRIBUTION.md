# Backend Task Distribution (Phase 1)

## Team Structure

- **3 Backend Developers**
- **6 Week Timeline**
- **Phase 1 Features: 7 Core Features**

## Task Assignment Strategy

### **Developer 1: Authentication & User Management** (Foundation)

**Priority: HIGH** - Everything depends on this

#### Week 1-2: Core Authentication

- [ ] **Auth Module** (auth/)
  - [ ] Register endpoint (POST /api/auth/register)
  - [ ] Login endpoint (POST /api/auth/login)
  - [ ] Logout endpoint (POST /api/auth/logout)
  - [ ] Refresh token endpoint (POST /api/auth/refresh)
  - [ ] Get current user (GET /api/auth/me)
  - [ ] Validation schemas (Zod)
  - [ ] JWT token generation/verification
  - [ ] Password hashing

- [ ] **Users Module** (users/)
  - [ ] Get user profile (GET /api/users/:id)
  - [ ] Update user profile (PUT /api/users/:id)
  - [ ] Change password (PUT /api/users/:id/password)
  - [ ] Delete account (DELETE /api/users/:id)
  - [ ] Profile history tracking

- [ ] **Middleware**
  - [ ] Authentication middleware (verify JWT)
  - [ ] Authorization middleware (role checking)
  - [ ] Validation middleware (Zod integration)

#### Deliverables:

- ✅ Users can register and login
- ✅ JWT authentication working
- ✅ Role-based access control implemented
- ✅ Postman collection for auth endpoints

### **Developer 2: Profiles & Directory** (Core Features)

**Priority: HIGH** - Main user-facing features

#### Week 1-2: Profile Management

- [ ] **Startups Module** (startups/)
  - [ ] Create startup profile (POST /api/startups)
  - [ ] Get startup profile (GET /api/startups/:id)
  - [ ] Update startup profile (PUT /api/startups/:id)
  - [ ] Delete startup profile (DELETE /api/startups/:id)
  - [ ] Get my startup (GET /api/startups/my-profile)
  - [ ] Submit for approval (POST /api/startups/:id/submit)
  - [ ] Validation schemas

- [ ] **Investors Module** (investors/)
  - [ ] Create investor profile (POST /api/investors)
  - [ ] Get investor profile (GET /api/investors/:id)
  - [ ] Update investor profile (PUT /api/investors/:id)
  - [ ] Delete investor profile (DELETE /api/investors/:id)
  - [ ] Get my investor profile (GET /api/investors/my-profile)
  - [ ] Validation schemas

#### Week 3: Public Directory.

- [ ] **Directory Module** (directory/)
  - [ ] Browse all startups (GET /api/directory/startups)
  - [ ] Search startups with filters (GET /api/directory/startups/search)
    - Filter by sector
    - Filter by stage
    - Filter by location
    - Text search
  - [ ] Pagination implementation
  - [ ] Directory statistics (GET /api/directory/stats)
  - [ ] Validation schemas

#### Deliverables:

- ✅ Startups can create and manage profiles
- ✅ Investors can create and manage profiles
- ✅ Public directory with search and filters working
- ✅ Postman collection for profile endpoints

### **Developer 3: Programs, Applications & Evaluations** (Workflow)

**Priority: MEDIUM** - Depends on profiles being ready

#### Week 2-3: Program Management

- [ ] **Programs Module** (programs/)
  - [ ] Create program (POST /api/programs) - Admin only
  - [ ] List all programs (GET /api/programs)
  - [ ] Get program details (GET /api/programs/:id)
  - [ ] Update program (PUT /api/programs/:id) - Admin only
  - [ ] Delete program (DELETE /api/programs/:id) - Admin only
  - [ ] Get program applicants (GET /api/programs/:id/applicants)
  - [ ] Validation schemas

- [ ] **Applications Module** (applications/)
  - [ ] Submit application (POST /api/applications)
  - [ ] Get application details (GET /api/applications/:id)
  - [ ] Update application (PUT /api/applications/:id)
  - [ ] Withdraw application (DELETE /api/applications/:id)
  - [ ] Get my applications (GET /api/applications/my-applications)
  - [ ] Check application status (GET /api/applications/:id/status)
  - [ ] Validation schemas

#### Week 4: Evaluation Workflow

- [ ] **Evaluations Module** (evaluations/)
  - [ ] Submit evaluation (POST /api/evaluations) - Reviewer only
  - [ ] Get evaluation details (GET /api/evaluations/:id)
  - [ ] Update evaluation (PUT /api/evaluations/:id)
  - [ ] Get my reviews (GET /api/evaluations/my-reviews)
  - [ ] Declare conflict of interest (POST /api/evaluations/:id/conflict)
  - [ ] Get all evaluations for application (GET /api/applications/:id/evaluations)
  - [ ] Validation schemas

#### Deliverables:

- ✅ Admins can create and manage programs
- ✅ Startups can apply to programs
- ✅ Reviewers can evaluate applications
- ✅ Conflict of interest checks working
- ✅ Postman collection for workflow endpoints

## Shared Tasks (All Developers)

### Week 4-5: Admin & Dashboard

**Work together on these**

- [ ] **Admin Module** (admin/)
  - [ ] Approve startup profile (PUT /api/admin/startups/:id/approve)
  - [ ] Reject startup profile (PUT /api/admin/startups/:id/reject)
  - [ ] Get pending profiles (GET /api/admin/startups/pending)
  - [ ] Assign reviewer to application (POST /api/admin/applications/:id/assign-reviewer)
  - [ ] Get available reviewers (GET /api/admin/reviewers/available)
  - [ ] List all users (GET /api/admin/users)
  - [ ] Change user role (PUT /api/admin/users/:id/role)
  - [ ] Activate/deactivate user (PUT /api/admin/users/:id/status)
  - [ ] System statistics (GET /api/admin/stats)

- [ ] **Dashboard Module** (dashboard/)
  - [ ] Get dashboard data (GET /api/dashboard) - Role-specific
  - [ ] Startup dashboard stats
  - [ ] Investor dashboard stats
  - [ ] Reviewer dashboard stats
  - [ ] Admin dashboard stats

### Week 5-6: Testing & Integration

- [ ] Write unit tests for services
- [ ] Write integration tests for API endpoints
- [ ] Test all workflows end-to-end
- [ ] Fix bugs
- [ ] API documentation (Postman/Swagger)
- [ ] Code review and refactoring

## Weekly Milestones

### Week 1

- ✅ Project setup complete
- ✅ Database schema finalized
- ✅ Authentication working
- ✅ Basic profile creation working

### Week 2

- ✅ All profile endpoints complete
- ✅ Directory with search working
- ✅ Program creation working

### Week 3

- ✅ Application submission working
- ✅ Evaluation workflow complete
- ✅ Admin approval system working

### Week 4

- ✅ All core features complete
- ✅ Dashboard endpoints working
- ✅ Integration between modules working

### Week 5

- ✅ All tests written and passing
- ✅ Bug fixes complete
- ✅ API documentation ready

### Week 6

- ✅ Final testing
- ✅ Code review complete
- ✅ Ready for frontend integration
- ✅ Deployment preparation

## Daily Workflow

### Morning (9:00 AM)

- Quick standup (15 min)
- Share what you did yesterday
- Share what you'll do today
- Mention any blockers

### During Day

- Work on assigned tasks
- Commit frequently with clear messages
- Push to your feature branch
- Ask for help in team chat if stuck

### End of Day (5:00 PM)

- Push your code
- Update task status
- Document any issues

## Git Workflow

### Branch Naming

```
feature/auth-module
feature/startup-profiles
feature/directory-search
fix/bug-description
```

### Commit Messages

```
feat: add user registration endpoint
fix: resolve JWT token expiration issue
docs: update API documentation
test: add unit tests for auth service
```

### Pull Request Process

1. Create PR with clear description
2. Request review from team lead
3. Address review comments
4. Merge after approval

## Communication

### Daily Standup

- Time: 9:00 AM
- Duration: 15 minutes
- Format: What did you do? What will you do? Any blockers?

### Code Review

- All PRs must be reviewed
- Review within 24 hours
- Be constructive and helpful

### Questions/Help

- Use team chat for quick questions
- Schedule call for complex issues
- Document solutions for future reference

## Learning Resources

### TypeScript + Express

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Express.js Guide: https://expressjs.com/en/guide/routing.html

### Prisma

- Prisma Docs: https://www.prisma.io/docs
- Prisma Schema Reference: https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### Testing

- Jest Documentation: https://jestjs.io/docs/getting-started

## ✅ Definition of Done

A task is complete when:
- [ ] Code is written and working
- [ ] Validation schemas are implemented
- [ ] Error handling is proper
- [ ] Code is committed and pushed
- [ ] Postman collection is updated
- [ ] Basic testing is done
- [ ] PR is created and reviewed

## Important Notes

1. **Don't work on the same file simultaneously** - Coordinate to avoid merge conflicts
2. **Test your endpoints** - Use Postman or Thunder Client
3. **Follow the folder structure** - Keep code organized
4. **Ask questions early** - Don't struggle alone
5. **Document as you go** - Update Postman collection
6. **Commit frequently** - Small commits are better
7. **Code review is mandatory** - Learn from each other

## Progress Tracking

Use this checklist to track overall progress:

### Foundation (Week 1-2)

- [ ] Authentication complete
- [ ] User management complete
- [ ] Middleware complete
- [ ] Startup profiles complete
- [ ] Investor profiles complete

### Core Features (Week 3-4)

- [ ] Directory and search complete
- [ ] Programs complete
- [ ] Applications complete
- [ ] Evaluations complete

### Admin & Polish (Week 5-6)

- [ ] Admin module complete
- [ ] Dashboard complete
- [ ] Testing complete
- [ ] Documentation complete

**Good luck team! Let's build something amazing!**
