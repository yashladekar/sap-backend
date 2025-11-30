import { prisma } from "../lib/prisma.js";
import type { CreateClientSystemDto, PaginationParams } from "../types/index.js";
import { parseSupportPackage } from "../lib/sap-parsers.js";

export class ClientSystemsService {
    async findAll(userId: string, params: PaginationParams) {
        const { page, limit } = params;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.clientSystem.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: { uploadedAt: "desc" },
                include: {
                    _count: {
                        select: {
                            components: true,
                            runs: true,
                        },
                    },
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

    async findById(id: string, userId: string) {
        // Use findFirst to also enforce user ownership
        return prisma.clientSystem.findFirst({
            where: { id, userId },
            include: {
                components: true,
                runs: {
                    orderBy: { startedAt: "desc" },
                    select: {
                        id: true,
                        status: true,
                        startedAt: true,
                        finishedAt: true,
                        batch: {
                            select: {
                                id: true,
                                monthKey: true,
                                status: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async create(userId: string, data: CreateClientSystemDto) {
        const formattedComponents = data.components.map((c) => {
            // If the user provided a raw support package string, parse it
            if (c.supportPackage && (!c.spLevel || !c.release)) {
                const parsed = parseSupportPackage(c.supportPackage);
                if (parsed && parsed.component && parsed.release) {
                    return {
                        name: parsed.component, // e.g. "SAP_BASIS"
                        release: parsed.release,
                        supportPackage: c.supportPackage,
                        spLevel: parsed.spLevel,
                    };
                }
            }

            // Fallback: use provided values
            return {
                name: c.name,
                release: c.release,
                supportPackage: c.supportPackage ?? null,
                spLevel: c.spLevel,
            };
        });

        return prisma.clientSystem.create({
            data: {
                userId,
                name: data.name,
                systemId: data.systemId,
                components: {
                    create: formattedComponents,
                },
            },
            include: {
                components: true,
            },
        });
    }
}

export const clientSystemsService = new ClientSystemsService();
