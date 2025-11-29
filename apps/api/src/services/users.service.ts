import { prisma } from "../lib/prisma.js";
import type { PaginationParams } from "../types/index.js";

export class UsersService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
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

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        emailVerified: true,
        image: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        updatedAt: true,
        runs: true,
        auditLogs: true,
        payments: true,
      },
    });
  }
}

export const usersService = new UsersService();
