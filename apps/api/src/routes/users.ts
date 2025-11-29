import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import {
  requirePermission,
  requireSuperAdmin,
  requireAdmin,
} from "../middleware/rbac.js";
import { Permission, Role, getManageableRoles } from "@workspace/auth";
import { z } from "zod";

const router = Router();

/**
 * GET /api/users - List all users (Admin only)
 */
router.get(
  "/",
  requireAuth,
  requirePermission(Permission.ADMIN_MANAGE_USERS),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
            image: true,
            banned: true,
            banReason: true,
            banExpires: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.user.count(),
      ]);

      res.json({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
);

/**
 * GET /api/users/:id - Get user by ID
 */
router.get(
  "/:id",
  requireAuth,
  requirePermission(Permission.USER_READ),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Users can only view their own profile unless they have admin access
      if (
        req.user?.id !== id &&
        req.user?.role !== Role.ADMIN &&
        req.user?.role !== Role.SUPER_ADMIN
      ) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          image: true,
          banned: true,
          banReason: true,
          banExpires: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  }
);

/**
 * PATCH /api/users/:id - Update user
 */
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  image: z.string().url().optional().nullable(),
});

router.patch(
  "/:id",
  requireAuth,
  requirePermission(Permission.USER_UPDATE),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Users can only update their own profile unless they have admin access
      if (
        req.user?.id !== id &&
        req.user?.role !== Role.ADMIN &&
        req.user?.role !== Role.SUPER_ADMIN
      ) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const validation = updateUserSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors });
        return;
      }

      const user = await prisma.user.update({
        where: { id },
        data: validation.data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }
);

/**
 * DELETE /api/users/:id - Delete user (Admin only)
 */
router.delete(
  "/:id",
  requireAuth,
  requirePermission(Permission.USER_DELETE),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Prevent self-deletion
      if (req.user?.id === id) {
        res.status(400).json({ error: "Cannot delete your own account" });
        return;
      }

      // Check if target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id },
        select: { role: true },
      });

      if (!targetUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Only super admin can delete admins
      if (
        targetUser.role === Role.ADMIN &&
        req.user?.role !== Role.SUPER_ADMIN
      ) {
        res.status(403).json({ error: "Only super admin can delete admins" });
        return;
      }

      await prisma.user.delete({ where: { id } });

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

/**
 * PATCH /api/users/:id/role - Update user role (Super Admin only)
 */
const updateRoleSchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MANAGER", "USER", "GUEST"]),
});

router.patch(
  "/:id/role",
  requireAuth,
  requireSuperAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;

      // Prevent changing own role
      if (req.user?.id === id) {
        res.status(400).json({ error: "Cannot change your own role" });
        return;
      }

      const validation = updateRoleSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors });
        return;
      }

      const { role } = validation.data;

      // Map incoming role to Prisma enum value
      const roleMap: Record<string, Role> = {
        SUPER_ADMIN: Role.SUPER_ADMIN,
        ADMIN: Role.ADMIN,
        MANAGER: Role.MANAGER,
        USER: Role.USER,
        GUEST: Role.GUEST,
      };
      const prismaRole = roleMap[role];

      // Check manageable roles
      const manageableRoles = getManageableRoles(req.user!.role as Role);
      if (
        role !== "SUPER_ADMIN" &&
        (!prismaRole || !manageableRoles.includes(prismaRole)) &&
        req.user?.role !== Role.SUPER_ADMIN
      ) {
        res
          .status(403)
          .json({ error: "Cannot assign role higher than your own" });
        return;
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role: prismaRole },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          updatedAt: true,
        },
      });

      res.json({ user });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ error: "Failed to update user role" });
    }
  }
);

export const userRoutes: Router = router;
