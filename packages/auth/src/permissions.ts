import { Role } from "./roles.js";

/**
 * Permission definitions for the application
 * Format: resource:action
 */
export enum Permission {
  // User permissions
  USER_READ = "user:read",
  USER_CREATE = "user:create",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",

  // Admin permissions
  ADMIN_ACCESS = "admin:access",
  ADMIN_MANAGE_USERS = "admin:manage_users",
  ADMIN_MANAGE_ROLES = "admin:manage_roles",

  // Resource permissions
  RESOURCE_READ = "resource:read",
  RESOURCE_CREATE = "resource:create",
  RESOURCE_UPDATE = "resource:update",
  RESOURCE_DELETE = "resource:delete",
}

/**
 * Role to permissions mapping
 * Supports wildcards: "*" for all permissions, "resource:*" for all resource actions
 */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: ["*"],
  [Role.ADMIN]: [
    Permission.ADMIN_ACCESS,
    Permission.ADMIN_MANAGE_USERS,
    "user:*",
    "resource:*",
  ],
  [Role.MANAGER]: [Permission.USER_READ, "resource:*"],
  [Role.USER]: [
    Permission.USER_READ,
    Permission.RESOURCE_READ,
    Permission.RESOURCE_CREATE,
  ],
  [Role.GUEST]: [Permission.RESOURCE_READ],
};

/**
 * Check if a permission matches a pattern (supports wildcards)
 */
function matchesPermission(
  permission: Permission | string,
  pattern: string
): boolean {
  if (pattern === "*") return true;

  if (pattern.endsWith(":*")) {
    const prefix = pattern.slice(0, -1);
    return permission.startsWith(prefix);
  }

  return permission === pattern;
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.some((p) => matchesPermission(permission, p));
}

/**
 * Get all permissions for a role (expanded from wildcards)
 */
export function getRolePermissions(role: Role): Permission[] {
  const patterns = ROLE_PERMISSIONS[role];
  if (!patterns) return [];

  const allPermissions = Object.values(Permission);

  if (patterns.includes("*")) {
    return allPermissions;
  }

  return allPermissions.filter((permission) =>
    patterns.some((pattern) => matchesPermission(permission, pattern))
  );
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}
