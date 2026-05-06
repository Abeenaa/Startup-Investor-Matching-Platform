// CORS Configuration
// This file defines Cross-Origin Resource Sharing settings
// Allows your frontend to communicate with the backend

import { CorsOptions } from 'cors';
import { CORS_ORIGIN } from './env';

export const corsOptions: CorsOptions = {
  origin: CORS_ORIGIN.split(','), // Support multiple origins (comma-separated)
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
