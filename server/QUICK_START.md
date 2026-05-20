# Server Quick Start Guide

## Current Issue: Database Connection Failed

Your server can't connect to the Supabase database. Here's how to fix it:

## 🚀 Quick Fix (Most Common)

### Your Supabase project is likely paused. Here's how to resume it:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Log in with your account

2. **Check Project Status**
   - Look for your project: `ulhzqocoltpbjoyupqnq`
   - If it shows "Paused" or "Inactive", click "Resume" or "Restore"

3. **Wait 1-2 minutes**
   - The project needs time to wake up

4. **Restart your server**
   ```bash
   npm run dev
   ```

## 🔍 Diagnose the Issue

Run our diagnostic tool to check what's wrong:

```bash
node check-db-connection.js
```

This will tell you exactly what the problem is.

## 🛠️ Alternative Solutions

### Option 1: Get Fresh Credentials from Supabase

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** > **Database**
4. Under "Connection string", select **Connection pooling**
5. Copy the connection string
6. Update your `.env` file:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Important**: Replace `[YOUR-PASSWORD]` with your actual password

### Option 2: Try Direct Connection

If pooler doesn't work, try direct connection (port 5432):

```env
DATABASE_URL=postgresql://postgres.ulhzqocoltpbjoyupqnq:abenezer%407E@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
```

### Option 3: Use Local Database (For Development)

If Supabase isn't working, use a local database:

#### Using Docker (Recommended)

1. Create `docker-compose.yml` in server folder:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: innobiz_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. Start database:
```bash
docker-compose up -d
```

3. Update `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/innobiz_dev
```

4. Run migrations:
```bash
npm run migrate
npm run seed
```

## 🎯 Step-by-Step Setup

### 1. Check Prerequisites

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Install dependencies if not done
npm install
```

### 2. Configure Environment

Make sure your `.env` file exists and has:

```env
NODE_ENV=development
PORT=5000

# Database (get from Supabase)
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...

# JWT Secrets (keep these for development)
JWT_SECRET=development-jwt-secret-key-32-characters-minimum-for-testing
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=development-refresh-secret-key-32-characters-minimum-for-testing
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Test Database Connection

```bash
node check-db-connection.js
```

### 4. Run Migrations (if database is connected)

```bash
npm run migrate
```

### 5. Seed Database (optional)

```bash
npm run seed
```

### 6. Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server started successfully!
📍 Port: 5000
🏥 Health check: http://localhost:5000/health
```

## 🐛 Still Having Issues?

### Check Supabase Status
- Visit: https://status.supabase.com/
- Make sure Supabase services are operational

### Review Logs
- Go to Supabase Dashboard > Logs
- Check for any errors or issues

### Common Errors

#### Error: "Can't reach database server"
**Cause**: Project paused or network issue
**Fix**: Resume project in Supabase Dashboard

#### Error: "password authentication failed"
**Cause**: Wrong password or not URL-encoded
**Fix**: Get fresh credentials from Supabase

#### Error: "timeout"
**Cause**: Firewall or network blocking connection
**Fix**: Check firewall, try different network

### Get Help

1. **Read detailed guide**: `DATABASE_TROUBLESHOOTING.md`
2. **Check Supabase docs**: https://supabase.com/docs
3. **Contact support**: If project won't resume

## 🎉 Success!

Once connected, you can:

1. **Test API**: http://localhost:5000/health
2. **View API docs**: Check POSTMAN_COLLECTION.json
3. **Start frontend**: 
   ```bash
   cd ../client
   npm run dev
   ```

## 📚 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
npm run test         # Run tests
```

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **API Documentation**: See POSTMAN_COLLECTION.json
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 💡 Pro Tips

1. **Keep Supabase project active**: Visit dashboard regularly to prevent auto-pause
2. **Use connection pooling**: Better performance with `?pgbouncer=true`
3. **Monitor logs**: Check Supabase logs for issues
4. **Backup data**: Export data regularly from Supabase

---

**Need more help?** Check `DATABASE_TROUBLESHOOTING.md` for detailed solutions.
