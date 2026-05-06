# Innobiz-K Backend API

Backend server for the Innobiz-K Startup Ecosystem Platform.

## Setup Instructions

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in values
3. Generate Prisma client: `npm run prisma:generate`
4. Run migrations: `npm run db:migrate`
5. Seed database: `npm run db:seed`
6. Start development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio
- `npm test` - Run tests

## Project Structure

See folder structure documentation in `/docs`
