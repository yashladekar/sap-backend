import type { Response, NextFunction } from "express";
import { Permission, hasPermission, Role, hasRoleLevel } from "@workspace/auth";
import type { AuthenticatedRequest } from "./auth.js";

/**
 * Middleware to require a specific permission
 */
export function requirePermission(permission: Permission) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;
    if (!hasPermission(userRole, permission)) {
      res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      return;
    }

    next();
  };
}

/**
 * Middleware to require any of the specified permissions
 */
export function requireAnyPermission(permissions: Permission[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;
    const hasAny = permissions.some((p) => hasPermission(userRole, p));

    if (!hasAny) {
      res.status(403).json({ error: "Forbidden - Insufficient permissions" });
      return;
    }

    next();
  };
}

/**
 * Middleware to require a minimum role level
 */
export function requireRole(role: Role) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userRole = req.user.role as Role;
    if (!hasRoleLevel(userRole, role)) {
      res.status(403).json({ error: "Forbidden - Insufficient role level" });
      return;
    }

    next();
  };
}

/**
 * Middleware to require admin access
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const userRole = req.user.role as Role;
  if (!hasPermission(userRole, Permission.ADMIN_ACCESS)) {
    res.status(403).json({ error: "Forbidden - Admin access required" });
    return;
  }

  next();
}

/**
 * Middleware to require super admin access
 */
export function requireSuperAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (req.user.role !== Role.SUPER_ADMIN) {
    res.status(403).json({ error: "Forbidden - Super admin access required" });
    return;
  }

  next();
}
