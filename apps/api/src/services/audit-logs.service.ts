import { prisma } from "../lib/prisma.js";
import type {
  CreateAuditLogDto,
  PaginationParams,
} from "../types/index.js";

export class AuditLogsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.auditLog.count(),
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
    return prisma.auditLog.findUnique({
      where: { id },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: CreateAuditLogDto) {
    return prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        details: data.details,
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    return prisma.auditLog.delete({
      where: { id },
    });
  }
}

export const auditLogsService = new AuditLogsService();
