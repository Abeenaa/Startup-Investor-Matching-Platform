// User Roles Constants
// Defines all user roles in the system

export enum UserRole {
  STARTUP = 'STARTUP',
  INVESTOR = 'INVESTOR',
  REVIEWER = 'REVIEWER',
  ADMIN = 'ADMIN',
}

// Role descriptions (for documentation)
export const ROLE_DESCRIPTIONS = {
  [UserRole.STARTUP]: 'Can create startup profile and apply to programs',
  [UserRole.INVESTOR]: 'Can create investor profile and search startups',
  [UserRole.REVIEWER]: 'Can evaluate applications assigned by admin',
  [UserRole.ADMIN]: 'Can approve profiles, create programs, and manage system',
};

// Check if a role is admin
export const isAdmin = (role: string): boolean => {
  return role === UserRole.ADMIN;
};

// Check if a role is reviewer
export const isReviewer = (role: string): boolean => {
  return role === UserRole.REVIEWER;
};
