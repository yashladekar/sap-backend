// apps/api/src/services/client-systems.service.ts
import { prisma } from "../lib/prisma.js";
import type { CreateClientSystemDto, PaginationParams } from "../types/index.js";

export class ClientSystemsService {
    async findAll(params: PaginationParams, userId: string) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.clientSystem.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { uploadedAt: "desc" },
                include: {
                    _count: { select: { components: true, runs: true } },
                },
            }),
            prisma.clientSystem.count({ where: { userId } }),
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

    async findById(id: string, userId: string): Promise<any> {
        return prisma.clientSystem.findFirst({
            where: { id, userId },
            include: {
                components: true,
                runs: {
                    include: {
                        batch: true,
                    },
                },
            },
        });
    }

    async create(userId: string, data: CreateClientSystemDto) {
        return prisma.clientSystem.create({
            data: {
                userId,
                name: data.name,
                systemId: data.systemId,
                components: {
                    create: data.components.map((c) => ({
                        name: c.name,
                        release: c.release,
                        supportPackage: c.supportPackage,
                        spLevel: c.spLevel,
                    })),
                },
            },
            include: {
                components: true,
            },
        });
    }
}

export const clientSystemsService = new ClientSystemsService();
