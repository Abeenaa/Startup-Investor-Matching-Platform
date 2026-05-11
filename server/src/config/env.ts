// Environment Variables Configuration
// This file validates and exports all environment variables
// Uses Zod for type-safe validation

import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file - points to server/.env regardless of where npm run dev is called from
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Define the schema for environment variables
const envSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  
  // Database
  DATABASE_URL: z.string().url('Invalid database URL'),
  
  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Optional: Email service (for future)
  // SMTP_HOST: z.string().optional(),
  // SMTP_PORT: z.string().optional(),
  // SMTP_USER: z.string().optional(),
  // SMTP_PASS: z.string().optional(),
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:');
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    process.exit(1);
  }
};

// Export validated environment variables
export const env = parseEnv();

// Export individual variables for convenience
export const {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  CORS_ORIGIN,
} = env;
