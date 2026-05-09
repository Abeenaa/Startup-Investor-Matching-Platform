// User Roles Constants

// Defines all user roles in the system

export enum UserRole {
  STARTUP = 'STARTUP',
  INVESTOR = 'INVESTOR',
  REVIEWER = 'REVIEWER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  STAFF_ADMIN = 'STAFF_ADMIN',
}

// Role descriptions (for documentation)
export const ROLE_DESCRIPTIONS = {
  [UserRole.STARTUP]: 'Can create startup profile and apply to programs',
  [UserRole.INVESTOR]: 'Can create investor profile and search startups',
  [UserRole.REVIEWER]: 'Can evaluate applications (assigned by staff admin)',
  [UserRole.SYSTEM_ADMIN]: 'Can approve profiles, create programs (managed by staff admin)',
  [UserRole.STAFF_ADMIN]: 'Super admin - can do everything + manage system admins + assign reviewers',
};

// Role hierarchy levels (higher number = more privileges)
export const ROLE_HIERARCHY = {
  [UserRole.STARTUP]: 1,
  [UserRole.INVESTOR]: 1,
  [UserRole.REVIEWER]: 2,
  [UserRole.SYSTEM_ADMIN]: 3,
  [UserRole.STAFF_ADMIN]: 4,
};

// Check if a role is staff admin (highest privilege)
export const isStaffAdmin = (role: string): boolean => {
  return role === UserRole.STAFF_ADMIN;
};

// Check if a role is system admin
export const isSystemAdmin = (role: string): boolean => {
  return role === UserRole.SYSTEM_ADMIN;
};

// Check if a role is any type of admin
export const isAdmin = (role: string): boolean => {
  return role === UserRole.SYSTEM_ADMIN || role === UserRole.STAFF_ADMIN;
};

// Check if a role is reviewer
export const isReviewer = (role: string): boolean => {
  return role === UserRole.REVIEWER;
};

// Check if user can manage another user (based on role hierarchy)
export const canManageRole = (managerRole: string, targetRole: string): boolean => {
  const managerLevel = ROLE_HIERARCHY[managerRole as UserRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole as UserRole] || 0;
  return managerLevel > targetLevel;
};
