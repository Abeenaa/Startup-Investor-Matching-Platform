// Auth Routes
// Defines all authentication API endpoints
// Enhanced with government-level security features

import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { authRateLimit } from '../../middleware/security';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from './auth.validation';

const router = Router();

// ─── Public Routes (with enhanced security) ──────────────────────────────────

// POST /api/auth/register - Enhanced with rate limiting
router.post('/register', 
  authRateLimit, 
  validate(registerSchema), 
  authController.register
);

// POST /api/auth/login - Enhanced with rate limiting
router.post('/login', 
  authRateLimit, 
  validate(loginSchema), 
  authController.login
);

// POST /api/auth/refresh - Enhanced with rate limiting
router.post('/refresh', 
  authRateLimit, 
  validate(refreshTokenSchema), 
  authController.refreshToken
);

// ─── Protected Routes (require valid JWT) ────────────────────────────────────

// GET /api/auth/me
router.get('/me', authenticate, authController.getMe);

// PATCH /api/auth/change-password
router.patch(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
