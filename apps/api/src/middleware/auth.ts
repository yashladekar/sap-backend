import type { Request, Response, NextFunction } from "express";
import { Role } from "@workspace/auth";
import { prisma } from "../lib/prisma.js";

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
 * Extract session token from cookies
 * Better Auth stores tokens as "token.signature" and URL-encodes them
 */
function getSessionToken(req: Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, ...valueParts] = cookie.trim().split("=");
    const value = valueParts.join("="); // Handle values with = in them
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);

  const rawToken = cookies["better-auth.session_token"];
  if (!rawToken) return null;

  // URL-decode the token
  const decodedToken = decodeURIComponent(rawToken);

  // Better Auth tokens are in format "token.signature" - we need just the token part
  const tokenPart = decodedToken.split(".")[0];

  return tokenPart || null;
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
    const token = getSessionToken(req);

    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Look up session directly from database
    const session = await prisma.session.findFirst({
      where: {
        token: token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Check if user is banned
    if (session.user.banned) {
      const now = new Date();
      if (!session.user.banExpires || session.user.banExpires > now) {
        res.status(403).json({
          error: "Account banned",
          reason: session.user.banReason,
          expires: session.user.banExpires,
        });
        return;
      }
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as Role,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
      banned: session.user.banned,
      banReason: session.user.banReason,
      banExpires: session.user.banExpires,
    };
    req.session = {
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
    };

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
    const token = getSessionToken(req);
    if (!token) {
      next();
      return;
    }

    const session = await prisma.session.findFirst({
      where: {
        token: token,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: true,
      },
    });

    if (session && !session.user.banned) {
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as Role,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        banned: session.user.banned,
        banReason: session.user.banReason,
        banExpires: session.user.banExpires,
      };
      req.session = {
        id: session.id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
      };
    }
    next();
  } catch {
    // Continue without auth
    next();
  }
}
