import type { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";
import { Role } from "@workspace/auth";

/**
 * Extended Request type with user session
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    emailVerified: boolean;
    image: string | null;
    banned: boolean;
    banReason: string | null;
    banExpires: Date | null;
  };
  session?: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
  };
}

/**
 * Authentication middleware - requires valid session
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if user is banned
    const user = session.user as AuthenticatedRequest["user"];
    if (user?.banned) {
      const now = new Date();
      if (!user.banExpires || user.banExpires > now) {
        res.status(403).json({
          error: "Account banned",
          reason: user.banReason,
          expires: user.banExpires,
        });
        return;
      }
    }

    req.user = user;
    req.session = session.session as AuthenticatedRequest["session"];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Optional authentication middleware - doesn't require session but attaches user if present
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as Record<string, string>,
    });

    if (session) {
      req.user = session.user as AuthenticatedRequest["user"];
      req.session = session.session as AuthenticatedRequest["session"];
    }
    next();
  } catch {
    // Continue without auth
    next();
  }
}
