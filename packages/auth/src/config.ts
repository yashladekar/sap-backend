import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@workspace/database";
import { admin } from "better-auth/plugins";

/**
 * Create Better Auth instance with Prisma adapter
 * This is the shared auth configuration used by both frontend and backend
 */
export function createAuth(options?: {
  baseURL?: string;
  secret?: string;
  trustedOrigins?: string[];
}) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),
    baseURL: options?.baseURL ?? process.env.BETTER_AUTH_URL,
    secret: options?.secret ?? process.env.BETTER_AUTH_SECRET,
    trustedOrigins: options?.trustedOrigins ?? [
      process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
    ],
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        enabled: !!(
          process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
        ),
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        enabled: !!(
          process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ),
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 1 day
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
        banned: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
        banReason: {
          type: "string",
          required: false,
          input: false,
        },
        banExpires: {
          type: "date",
          required: false,
          input: false,
        },
      },
    },
    plugins: [admin()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
