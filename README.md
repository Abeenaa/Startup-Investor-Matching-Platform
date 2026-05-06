# Innobiz-K Ethiopia: Startup-Investor Matching Platform

###  Vision
Innobiz-K Ethiopia is the nation's premier incubation center. This platform serves as the digital bridge between high-potential Ethiopian startups and global/local investors, fostering a transparent, data-driven, and scalable entrepreneurship ecosystem.

---

## 🛠 Tech Stack
- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express.js + TypeScript
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** JWT & Role-Based Access Control
- **ORM:** Prisma
- **Validation:** Zod

---

## ✨ Phase 1 Features (6 Weeks)
1. ✅ User Registration & Account Management (RBAC)
2. ✅ Startup Profile Management
3. ✅ Investor Profile Management
4. ✅ Public Startup Directory
5. ✅ Search & Filtering
6. ✅ Program Application Management
7. ✅ Evaluation & Review Workflow

---

## 👥 Team Structure
- **Backend Team:** 3 Developers
- **Frontend Team:** 2 Developers
- **Timeline:** 6 Weeks

---

## 🚀 Quick Start

### For Backend Developers
```bash
# Clone repository
git clone <repository-url>
cd innobiz-k-platform/server

# Follow setup guide
See server/SETUP.md for detailed instructions

# Check your tasks
See server/TASK_DISTRIBUTION.md for task assignments
```

### For Frontend Developers
```bash
# Clone repository
git clone <repository-url>
cd innobiz-k-platform/client

# Setup instructions coming soon
```

---

## 📚 Documentation

### Backend
- **[SETUP.md](server/SETUP.md)** - Complete setup instructions
- **[TASK_DISTRIBUTION.md](server/TASK_DISTRIBUTION.md)** - Task assignments for 3 developers
- **[QUICK_REFERENCE.md](server/QUICK_REFERENCE.md)** - Quick reference for common tasks
- **[SRS Document](docs/innobiz-k-srs.txt)** - Complete requirements specification

### General
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development workflow and guidelines
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - GitHub setup and collaboration guide

---

## 🏗 Project Structure

```
innobiz-k-platform/
├── server/                 # Backend (Node.js + Express + TypeScript)
│   ├── prisma/            # Database schema and migrations
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── middleware/    # Express middleware
│   │   ├── modules/       # Feature modules (auth, startups, etc.)
│   │   ├── shared/        # Shared utilities and constants
│   │   ├── app.ts         # Express app setup
│   │   ├── server.ts      # Server entry point
│   │   └── routes.ts      # Main router
│   └── tests/             # Unit and integration tests
│
├── client/                 # Frontend (React + Tailwind) - Coming soon
│
└── docs/                   # Documentation and SRS
```

---

## 🔐 User Roles

| Role | Description |
|------|-------------|
| **STARTUP** | Create profile, apply to programs |
| **INVESTOR** | Create profile, search startups |
| **REVIEWER** | Evaluate applications |
| **ADMIN** | Manage everything (approve profiles, create programs, assign reviewers) |

---

## 🔒 Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation with Zod
- Database-level security with Prisma
- CORS protection

---

## 📊 Development Workflow

1. **Pick a task** from TASK_DISTRIBUTION.md
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Write code** following the module pattern
4. **Test** your endpoints
5. **Commit**: `git commit -m "feat: your feature"`
6. **Push**: `git push origin feature/your-feature`
7. **Create PR** and request review
8. **Merge** after approval

---

## 🤝 Contribution Guidelines

### Commit Message Format
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation

### Code Review
- All PRs must be reviewed
- Review within 24 hours
- Be constructive and helpful

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📞 Communication

### Daily Standup (9:00 AM)
- What did you do yesterday?
- What will you do today?
- Any blockers?

### Code Review
- Review PRs promptly
- Provide constructive feedback
- Ask questions if unclear

---

## 🎯 Milestones

### Week 1-2: Foundation
- ✅ Authentication & user management
- ✅ Profile creation (startups & investors)

### Week 3-4: Core Features
- ✅ Public directory with search
- ✅ Programs & applications
- ✅ Evaluation workflow

### Week 5-6: Polish & Testing
- ✅ Admin dashboard
- ✅ Testing & bug fixes
- ✅ Documentation & deployment prep

---

## 🔗 Useful Links

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)

---

## 📄 License

© 2026 Innobiz-K Ethiopia Project Team  
Supported by the Ministry of Innovation and Technology (MInT)

---

**Let's build something amazing! 🚀**
