// Express Type Extensions
// Extends Express Request interface to include custom properties

import { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      // Authenticated user information (set by auth middleware)
      user?: JwtPayload & {
        startup?: { id: string } | null;
        investor?: { id: string } | null;
      };
    }
  }
}

export {};
