# Database Connection Troubleshooting Guide

## Error: Can't reach database server

If you're seeing this error:
```
Can't reach database server at `aws-1-eu-north-1.pooler.supabase.com:6543`
```

## Quick Fixes

### 1. Check Supabase Project Status

Your Supabase project might be paused due to inactivity:

1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Check if your project shows as "Paused"
4. If paused, click "Resume" or "Restore"
5. Wait 1-2 minutes for the project to become active

### 2. Verify Database Credentials

Check your `.env` file has the correct connection string:

```env
# Get this from Supabase Dashboard > Settings > Database
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**To get your connection string:**
1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings > Database
4. Copy the "Connection string" under "Connection pooling"
5. Replace `[YOUR-PASSWORD]` with your actual database password

### 3. Try Direct Connection

If pooler connection fails, try the direct connection:

```env
# Direct connection (port 5432)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:5432/postgres
```

### 4. Check Network/Firewall

- Ensure your firewall allows outbound connections to port 6543 (pooler) or 5432 (direct)
- Try disabling VPN if you're using one
- Check if your antivirus is blocking the connection

### 5. Test Connection Manually

Test if you can reach the database using `psql` or a database client:

```bash
# Using psql (if installed)
psql "postgresql://postgres.ulhzqocoltpbjoyupqnq:abenezer%407E@aws-1-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

## Alternative: Use Local Database

For development, you can use a local PostgreSQL database:

### Option A: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
   ```bash
   createdb innobiz_dev
   ```
3. Update `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/innobiz_dev
   ```

### Option B: Docker PostgreSQL

1. Create `docker-compose.yml`:
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

## Run Without Database (Frontend Development Only)

If you only need to work on the frontend, you can temporarily disable the database:

1. Edit `server/src/server.ts`:
   ```typescript
   // Comment out this line:
   // await connectDatabase()
   
   // Add this instead:
   console.log('⚠️  Running without database connection')
   ```

2. Mock API responses in your controllers

## Common Issues

### Issue: Password contains special characters

**Solution**: URL-encode special characters in your password:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

Example:
```
Password: myPass@123
Encoded:  myPass%40123
```

### Issue: Connection timeout

**Solution**: 
1. Check your internet connection
2. Try increasing timeout in Prisma schema:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     connectionLimit = 5
     poolTimeout = 30
   }
   ```

### Issue: Too many connections

**Solution**: Use connection pooling (pgbouncer):
```env
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=5
```

## Verify Connection

After fixing, verify the connection:

```bash
cd server
npm run dev
```

You should see:
```
✅ Database connected successfully
Server running on port 5000
```

## Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com/
2. **Review Supabase Logs**: Dashboard > Logs
3. **Check Project Settings**: Dashboard > Settings > Database
4. **Contact Support**: If project is paused and won't resume

## Environment Variables Reference

```env
# Required
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true
DIRECT_DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Optional (for better performance)
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=5&pool_timeout=30
```

## Next Steps

Once connected:
1. Run migrations: `npm run migrate`
2. Seed database: `npm run seed`
3. Start server: `npm run dev`
