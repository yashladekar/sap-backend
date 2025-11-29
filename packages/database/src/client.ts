import { PrismaClient } from "../generated/prisma";
// Import Node.js types for global and process
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Ensure the correct path to the generated client module
export * from "../generated/prisma";
