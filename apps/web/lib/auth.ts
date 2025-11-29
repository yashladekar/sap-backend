import { createAuth } from "@workspace/auth";

/**
 * Better Auth instance for the Next.js server
 * BETTER_AUTH_SECRET environment variable is required at runtime
 */
export const auth = createAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  // Secret is required - will use env var or a build-time placeholder
  // The actual value MUST be set in production via environment variable
  secret: process.env.BETTER_AUTH_SECRET ?? "placeholder-secret-for-build-only",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  ],
});
