# Innobiz-K Platform — Run Guide

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Staff Admin | staff.admin@innobiz.et | StaffAdmin@123 |
| System Admin | system.admin@innobiz.et | SystemAdmin@123 |
| Reviewer | reviewer@innobiz.et | Reviewer@123456 |
| Startup | startup@innobiz.et | Startup@123456 |
| Investor | investor@innobiz.et | Investor@123456 |

> Password policy: min 12 chars, uppercase, lowercase, number, special character

---

## Step 1 — Fix Database (one time only)

If you get `P1010: User denied access`, run this in your terminal:

```bash
sudo -u postgres psql
```

Then paste these **one at a time**, pressing Enter after each:

```sql
GRANT ALL PRIVILEGES ON DATABASE innobiz_k TO innobiz;
```
```sql
\c innobiz_k
```
```sql
GRANT ALL ON SCHEMA public TO innobiz;
```
```sql
ALTER SCHEMA public OWNER TO innobiz;
```
```sql
\q
```

**OR** — simplest fix, use postgres superuser directly.
Edit `server/.env`:
```env
DATABASE_URL=postgresql://postgres@localhost:5432/innobiz_k
DIRECT_DATABASE_URL=postgresql://postgres@localhost:5432/innobiz_k
```

---

## Step 2 — Setup (one time only)

```bash
# From project root
npm install
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

---

## Step 3 — Install frontend dependencies (one time only)

```bash
cd landing-page && npm install && cd ..
cd dashboards/admin && npm install && cd ../..
cd dashboards/staff && npm install && cd ../..
cd dashboards/reviewer && npm install && cd ../..
cd dashboards/system-admin && npm install && cd ../..
cd dashboards/investor && npm install && cd ../..
cd dashboards/startup && npm install && cd ../..
```

---

## Step 4 — Run everything

Open **8 terminals** (or use tmux/tabs):

### Terminal 1 — Backend API
```bash
npm run dev
# → http://localhost:5000/api
```

### Terminal 2 — Landing Page
```bash
cd landing-page && npm run dev
# → http://localhost:3000
```

### Terminal 3 — Staff Admin
```bash
cd dashboards/staff && npm run dev -- --port 3001
# → http://localhost:3001
```

### Terminal 4 — Reviewer
```bash
cd dashboards/reviewer && npm run dev -- --port 3002
# → http://localhost:3002
```

### Terminal 5 — Admin (Staff + System)
```bash
cd dashboards/admin && npm run dev -- --port 3003
# → http://localhost:3003
```

### Terminal 6 — Investor Portal
```bash
cd dashboards/investor && npm run dev -- --port 3004
# → http://localhost:3004
```

### Terminal 7 — Startup Portal
```bash
cd dashboards/startup && npm run dev -- --port 3005
# → http://localhost:3005
```

### Terminal 8 — System Admin
```bash
cd dashboards/system-admin && npm run dev -- --port 3006
# → http://localhost:3006
```

---

## Port Map

| Service | URL | Login |
|---------|-----|-------|
| Backend API | http://localhost:5000 | — |
| Landing Page | http://localhost:3000 | — |
| Staff Admin | http://localhost:3001 | staff.admin@innobiz.et / StaffAdmin@123 |
| Reviewer | http://localhost:3002 | reviewer@innobiz.et / Reviewer@123 |
| Admin Portal | http://localhost:3003 | staff.admin or system.admin |
| Investor Portal | http://localhost:3004 | investor@innobiz.et / Investor@123 |
| Startup Portal | http://localhost:3005 | startup@innobiz.et / Startup@123 |
| System Admin | http://localhost:3006 | system.admin@innobiz.et / SystemAdmin@123 |

---

## Quick one-liner (all frontends in background)

```bash
(cd landing-page && npm run dev) &
(cd dashboards/staff && npm run dev -- --port 3001) &
(cd dashboards/reviewer && npm run dev -- --port 3002) &
(cd dashboards/admin && npm run dev -- --port 3003) &
(cd dashboards/investor && npm run dev -- --port 3004) &
(cd dashboards/startup && npm run dev -- --port 3005) &
(cd dashboards/system-admin && npm run dev -- --port 3006) &
```

Run backend separately: `npm run dev`

---

## What each dashboard does

### Staff Admin (3001)
- Create/edit/close programs
- Approve or reject applications (with reason)
- View users by role
- Change password

### Reviewer (3002)
- See pending assignments
- Submit evaluations with score (0–10), feedback, recommendation
- View completed evaluations
- Scoring guide, conflict of interest policy
- Change password

### Admin Portal (3003)
- Works for both STAFF_ADMIN and SYSTEM_ADMIN
- Full CRUD on users, programs, applications
- Reports with charts
- Change password

### Investor Portal (3004)
- Browse verified startup directory with filters
- View startup detail pages
- See AI match recommendations
- Create/update investor profile
- Change password

### Startup Portal (3005)
- Create/update startup profile
- Apply to programs with one click
- Track application status
- Submit/delete draft applications
- Change password

### System Admin (3006)
- Platform-wide user management
- System health metrics (servers, database, security)
- Security page with all user accounts
- Change password
