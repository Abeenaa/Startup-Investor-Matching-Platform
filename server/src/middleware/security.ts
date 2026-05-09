// Advanced Security Middleware
// Government-level security features for the platform

import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ForbiddenError, TooManyRequestsError } from '../shared/errors/AppError';
import { NODE_ENV } from '../config/env';

// Rate Limiting

//General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin operation rate limiting
export const adminRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit admin operations
  message: {
    success: false,
    message: 'Too many admin operations, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Request Validation 
//Validate request headers for security
export const validateHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Check for required security headers in production
  if (NODE_ENV === 'production') {
    const userAgent = req.get('User-Agent');
    if (!userAgent || userAgent.length < 10) {
      throw new ForbiddenError('Invalid request headers');
    }
  }

  // Prevent common attack vectors
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ];

  const checkValue = (value: string) => {
    return suspiciousPatterns.some(pattern => pattern.test(value));
  };

  // Check query parameters
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string' && checkValue(value)) {
      throw new ForbiddenError('Malicious content detected in request');
    }
  }

  // Check request body
  if (req.body && typeof req.body === 'object') {
    const bodyStr = JSON.stringify(req.body);
    if (checkValue(bodyStr)) {
      throw new ForbiddenError('Malicious content detected in request body');
    }
  }

  next();
};

// IP Whitelisting

//IP whitelist for admin operations (optional, for high-security environments)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (NODE_ENV === 'development') {
      return next(); // Skip in development
    }

    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!allowedIPs.includes(clientIP as string)) {
      throw new ForbiddenError('Access denied from this IP address');
    }

    next();
  };
};

// Session Security 
//Track user sessions and detect suspicious activity
interface UserSession {
  userId: string;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
  loginCount: number;
}

const activeSessions = new Map<string, UserSession>();

export const sessionSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next();
  }

  const userId = req.user.id;
  const currentIP = req.ip || 'unknown';
  const currentUA = req.get('User-Agent') || 'unknown';
  const now = new Date();

  const existingSession = activeSessions.get(userId);

  if (existingSession) {
    // Check for suspicious activity
    const timeDiff = now.getTime() - existingSession.lastActivity.getTime();
    const isNewIP = existingSession.ipAddress !== currentIP;
    const isNewUA = existingSession.userAgent !== currentUA;

    // Flag suspicious login patterns
    if (isNewIP && timeDiff < 60000) { // New IP within 1 minute
      console.warn(`🚨 Suspicious activity detected for user ${userId}: IP change too fast`);
    }

    if (isNewUA && timeDiff < 300000) { // New user agent within 5 minutes
      console.warn(`🚨 Suspicious activity detected for user ${userId}: User agent change`);
    }

    // Update session
    existingSession.lastActivity = now;
    existingSession.ipAddress = currentIP;
    existingSession.userAgent = currentUA;
  } else {
    // Create new session
    activeSessions.set(userId, {
      userId,
      lastActivity: now,
      ipAddress: currentIP,
      userAgent: currentUA,
      loginCount: 1,
    });
  }

  next();
};

// Data Sanitization 
//Sanitize input data to prevent injection attacks
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/onload=/gi, '')
        .replace(/onerror=/gi, '')
        .trim();
    }
    
    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }
    
    if (value && typeof value === 'object') {
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
};

// Audit Logging
//Log all admin and sensitive operations for audit trail
export const auditLog = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log the request and response for audit
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
      userRole: req.user?.role,
      statusCode: res.statusCode,
      // Don't log sensitive data like passwords
      body: req.method !== 'GET' ? sanitizeForLog(req.body) : undefined,
    };

    // In production, this should go to a secure audit log system
    if (NODE_ENV === 'production') {
      console.log('AUDIT:', JSON.stringify(logData));
    }

    return originalSend.call(this, data);
  };

  next();
};

//Remove sensitive fields from audit logs
function sanitizeForLog(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const sensitiveFields = ['password', 'passwordHash', 'token', 'secret'];
  const sanitized = { ...data };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}