// Security Configuration
// Government-level security settings and constants

import { NODE_ENV } from './env';

// ─── Password Policy ─────────────────────────────────────────────────────────

export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  preventReuse: 5, // last N passwords
} as const;

// ─── Session Configuration ──────────────────────────────────────────────────

export const SESSION_CONFIG = {
  maxConcurrentSessions: 3,
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  inactivityTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const;

// ─── Rate Limiting Configuration ────────────────────────────────────────────

export const RATE_LIMITS = {
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // requests per window
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // login attempts per window
  },
  admin: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 50, // admin operations per window
  },
  api: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // API calls per minute
  },
} as const;

// ─── Security Headers ───────────────────────────────────────────────────────

export const SECURITY_HEADERS = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
} as const;

// ─── Audit Configuration ────────────────────────────────────────────────────

export const AUDIT_CONFIG = {
  logSensitiveOperations: true,
  logFailedAttempts: true,
  logAdminActions: true,
  retentionPeriod: 365, // days
  sensitiveFields: [
    'password',
    'passwordHash',
    'token',
    'secret',
    'key',
    'authorization',
  ],
} as const;

// ─── IP Whitelist (for high-security environments) ──────────────────────────

export const IP_WHITELIST = {
  enabled: NODE_ENV === 'production',
  adminIPs: [
    // Add specific IP addresses for admin access in production
    // '192.168.1.100',
    // '10.0.0.50',
  ],
  allowedRanges: [
    // Add IP ranges for organizational access
    // '192.168.1.0/24',
    // '10.0.0.0/8',
  ],
} as const;

// ─── Data Classification ────────────────────────────────────────────────────

export const DATA_CLASSIFICATION = {
  PUBLIC: 'public',
  INTERNAL: 'internal',
  CONFIDENTIAL: 'confidential',
  RESTRICTED: 'restricted',
} as const;

// ─── Encryption Configuration ───────────────────────────────────────────────

export const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
  saltRounds: 12, // for bcrypt
} as const;

// ─── Compliance Requirements ────────────────────────────────────────────────

export const COMPLIANCE = {
  dataRetention: {
    userProfiles: 7 * 365, // 7 years
    auditLogs: 10 * 365, // 10 years
    applicationData: 5 * 365, // 5 years
  },
  accessControl: {
    requireMFA: false, // Can be enabled for high-security environments
    requirePasswordChange: true,
    maxPasswordAge: 90, // days
  },
  monitoring: {
    logAllAccess: true,
    alertOnSuspiciousActivity: true,
    requireApprovalForSensitiveOps: true,
  },
} as const;

// ─── Security Validation Functions ──────────────────────────────────────────

/**
 * Validate password against security policy
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }

  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (PASSWORD_POLICY.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if IP address is in whitelist
 */
export function isIPWhitelisted(ip: string): boolean {
  if (!IP_WHITELIST.enabled) {
    return true; // Allow all IPs in development
  }

  return IP_WHITELIST.adminIPs.includes(ip as never);
}

/**
 * Classify data sensitivity level
 */
export function classifyData(dataType: string): string {
  const sensitiveTypes = ['password', 'ssn', 'financial', 'medical'];
  const confidentialTypes = ['profile', 'application', 'evaluation'];
  const internalTypes = ['user', 'startup', 'investor'];

  if (sensitiveTypes.some(type => dataType.toLowerCase().includes(type))) {
    return DATA_CLASSIFICATION.RESTRICTED;
  }

  if (confidentialTypes.some(type => dataType.toLowerCase().includes(type))) {
    return DATA_CLASSIFICATION.CONFIDENTIAL;
  }

  if (internalTypes.some(type => dataType.toLowerCase().includes(type))) {
    return DATA_CLASSIFICATION.INTERNAL;
  }

  return DATA_CLASSIFICATION.PUBLIC;
}