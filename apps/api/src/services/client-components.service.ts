import { prisma } from "../lib/prisma.js";
import type {
  CreateClientComponentDto,
  UpdateClientComponentDto,
  PaginationParams,
} from "../types/index.js";

export class ClientComponentsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.clientComponent.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.clientComponent.count(),
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
    return prisma.clientComponent.findUnique({
      where: { id },
      include: {
        noteApplicabilityResults: true,
      },
    });
  }

  async create(data: CreateClientComponentDto) {
    return prisma.clientComponent.create({
      data: {
        name: data.name,
        installedVersion: data.installedVersion,
        kernelVersion: data.kernelVersion,
        metadata: data.metadata ?? undefined,
      },
    });
  }

  async update(id: string, data: UpdateClientComponentDto) {
    return prisma.clientComponent.update({
      where: { id },
      data: {
        name: data.name,
        installedVersion: data.installedVersion,
        kernelVersion: data.kernelVersion,
        metadata: data.metadata,
      },
    });
  }

  async delete(id: string) {
    return prisma.clientComponent.delete({
      where: { id },
    });
  }
}

export const clientComponentsService = new ClientComponentsService();
