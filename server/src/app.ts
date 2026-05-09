// Express Application Setup
// Configures Express app with middleware and routes
// Enhanced with government-level security features

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './config/cors';
import { errorHandler } from './middleware/errorHandler';
import { 
  generalRateLimit, 
  validateHeaders, 
  sanitizeInput, 
  sessionSecurity,
  auditLog 
} from './middleware/security';
import router from './routes';
import { NODE_ENV } from './config/env';

// Create Express app
const app: Application = express();

// SECURITY MIDDLEWARE
// Trust proxy (for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security headers with enhanced configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// Rate limiting
app.use(generalRateLimit);

// Input validation and sanitization
app.use(validateHeaders);
app.use(sanitizeInput);

// STANDARD MIDDLEWARE

// CORS
app.use(cors(corsOptions));

// Request logging
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging with more details
  app.use(morgan('combined'));
}

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session security tracking
app.use(sessionSecurity);

// Audit logging for sensitive operations
app.use('/api/admin', auditLog);
app.use('/api/auth', auditLog);

// ROUTES
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// API routes
app.use('/api', router);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ERROR HANDLING

// Global error handler
app.use(errorHandler);

export default app;
