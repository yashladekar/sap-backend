"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client for client-side usage
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

// Update user using Better Auth's built-in method
export const updateUser = authClient.updateUser;

// Password reset function type
type ForgetPasswordOpts = { email: string; redirectTo: string };
type ResetPasswordOpts = { newPassword: string; token: string };
type AuthResult = { error?: { message: string } };

// Password reset functions - provide fallback since the method may not exist
export const forgetPassword = async (opts: ForgetPasswordOpts): Promise<AuthResult> => {
  try {
    // Use fetch directly for password reset
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth/forget-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
      credentials: "include",
    });
    if (!response.ok) {
      return { error: { message: "Failed to send reset email" } };
    }
    return {};
  } catch {
    return { error: { message: "Failed to send reset email" } };
  }
};

export const resetPassword = async (opts: ResetPasswordOpts): Promise<AuthResult> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
      credentials: "include",
    });
    if (!response.ok) {
      return { error: { message: "Failed to reset password" } };
    }
    return {};
  } catch {
    return { error: { message: "Failed to reset password" } };
  }
};

// Extended user type with role (lowercase to match database enum)
export interface ExtendedUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  role?: "super_admin" | "admin" | "manager" | "user" | "guest";
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
}

// Helper to get user with extended type
export function getExtendedUser(user: unknown): ExtendedUser {
  const u = user as Record<string, unknown>;
  return {
    id: u.id as string,
    email: u.email as string,
    name: (u.name as string) ?? null,
    image: (u.image as string) ?? null,
    emailVerified: (u.emailVerified as boolean) ?? false,
    role: (u.role as ExtendedUser["role"]) ?? "user",
    banned: (u.banned as boolean) ?? false,
    banReason: (u.banReason as string) ?? null,
    banExpires: u.banExpires ? new Date(u.banExpires as string) : null,
  };
}
