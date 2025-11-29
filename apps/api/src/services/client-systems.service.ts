import { prisma } from "../lib/prisma.js";
import type { CreateClientSystemDto, PaginationParams } from "../types/index.js";
import { parseSupportPackage } from "../lib/sap-parsers.js"; // Import your helper

export class ClientSystemsService {
    // ... findAll and findById remain the same ...

    async create(userId: string, data: CreateClientSystemDto) {
        // Transform the input data using the parser
        const formattedComponents = data.components.map((c) => {
            // If the user provided a raw support package string, parse it
            if (c.supportPackage && (!c.spLevel || !c.release)) {
                const parsed = parseSupportPackage(c.supportPackage);
                if (parsed && parsed.component && parsed.release) {
                    return {
                        name: parsed.component,   // e.g. "SAP_BASIS"
                        release: parsed.release,  // e.g. "750"
                        supportPackage: c.supportPackage,
                        spLevel: parsed.spLevel   // e.g. 5 (Integer)
                    };
                }
            }

            // Fallback: use provided data if parsing wasn't needed/possible
            // Ensure name and release are always defined (required by schema)
            return {
                name: c.name ?? "",
                release: c.release ?? "",
                supportPackage: c.supportPackage ?? null,
                spLevel: c.spLevel ?? 0,
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