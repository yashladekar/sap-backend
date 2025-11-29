/**
 * Role definitions for the application
 * Hierarchical role system with super_admin having highest privileges
 */
export enum Role {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  USER = "user",
  GUEST = "guest",
}

/**
 * Role hierarchy - higher index means more permissions
 */
export const ROLE_HIERARCHY: Role[] = [
  Role.GUEST,
  Role.USER,
  Role.MANAGER,
  Role.ADMIN,
  Role.SUPER_ADMIN,
];

/**
 * Check if a role has at least the level of another role
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    [Role.SUPER_ADMIN]: "Super Admin",
    [Role.ADMIN]: "Admin",
    [Role.MANAGER]: "Manager",
    [Role.USER]: "User",
    [Role.GUEST]: "Guest",
  };
  return displayNames[role];
}

/**
 * Get all roles that a given role can manage
 */
export function getManageableRoles(role: Role): Role[] {
  const roleIndex = ROLE_HIERARCHY.indexOf(role);
  return ROLE_HIERARCHY.filter((_, index) => index < roleIndex);
}
