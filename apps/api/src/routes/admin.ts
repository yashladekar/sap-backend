import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/rbac.js";
import { z } from "zod";
import { Role } from "@workspace/auth";

const router = Router();

/**
 * GET /api/admin/stats - Get dashboard statistics
 */
router.get(
  "/stats",
  requireAuth,
  requireAdmin,
  async (_req: AuthenticatedRequest, res) => {
    try {
      const [
        totalUsers,
        activeUsers,
        bannedUsers,
        usersByRole,
        recentSignups,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { banned: false } }),
        prisma.user.count({ where: { banned: true } }),
        prisma.user.groupBy({
          by: ["role"],
          _count: { role: true },
        }),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        }),
      ]);

      res.json({
        stats: {
          totalUsers,
          activeUsers,
          bannedUsers,
          usersByRole: usersByRole.reduce(
            (acc, item) => {
              acc[item.role] = item._count.role;
              return acc;
            },
            {} as Record<string, number>
          ),
        },
        recentSignups,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ error: "Failed to fetch statistics" });
    }
  }
);

/**
 * POST /api/admin/users/ban - Ban a user
 */
const banUserSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(1).max(500).optional(),
  expiresAt: z.string().datetime().optional(),
});

router.post(
  "/users/ban",
  requireAuth,
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const validation = banUserSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors });
        return;
      }

      const { userId, reason, expiresAt } = validation.data;

      // Cannot ban yourself
      if (req.user?.id === userId) {
        res.status(400).json({ error: "Cannot ban yourself" });
        return;
      }

      // Check target user
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!targetUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Cannot ban admins unless super admin
      if (
        (targetUser.role === Role.ADMIN || targetUser.role === Role.SUPER_ADMIN) &&
        req.user?.role !== Role.SUPER_ADMIN
      ) {
        res.status(403).json({ error: "Cannot ban admin users" });
        return;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          banned: true,
          banReason: reason ?? "Banned by administrator",
          banExpires: expiresAt ? new Date(expiresAt) : null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          banned: true,
          banReason: true,
          banExpires: true,
        },
      });

      res.json({ user, message: "User banned successfully" });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ error: "Failed to ban user" });
    }
  }
);

/**
 * POST /api/admin/users/unban - Unban a user
 */
const unbanUserSchema = z.object({
  userId: z.string().min(1),
});

router.post(
  "/users/unban",
  requireAuth,
  requireAdmin,
  async (req: AuthenticatedRequest, res) => {
    try {
      const validation = unbanUserSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({ error: validation.error.errors });
        return;
      }

      const { userId } = validation.data;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          banned: false,
          banReason: null,
          banExpires: null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          banned: true,
        },
      });

      res.json({ user, message: "User unbanned successfully" });
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ error: "Failed to unban user" });
    }
  }
);

export const adminRoutes: Router = router;
