import { prisma } from "../lib/prisma.js";
import type {
  CreateSapNoteBatchDto,
  UpdateSapNoteBatchDto,
  PaginationParams,
} from "../types/index.js";

/**
 * Helper to convert optional date string to Date or undefined/null for Prisma updates
 */
function parseDateForUpdate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined; // Don't update the field
  }
  if (value === null) {
    return null; // Set the field to null
  }
  return new Date(value); // Set the field to the parsed date
}

export class SapNoteBatchesService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.sapNoteBatch.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.sapNoteBatch.count(),
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
    return prisma.sapNoteBatch.findUnique({
      where: { id },
      include: {
        sapBatchNotes: {
          include: {
            note: true,
          },
        },
        runs: true,
      },
    });
  }

  async create(data: CreateSapNoteBatchDto) {
    return prisma.sapNoteBatch.create({
      data: {
        monthKey: data.monthKey,
        notesFileS3: data.notesFileS3,
        status: data.status,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        finishedAt: data.finishedAt ? new Date(data.finishedAt) : undefined,
        metadata: data.metadata ?? undefined,
      },
    });
  }

  async update(id: string, data: UpdateSapNoteBatchDto) {
    return prisma.sapNoteBatch.update({
      where: { id },
      data: {
        monthKey: data.monthKey,
        notesFileS3: data.notesFileS3,
        status: data.status,
        startedAt: parseDateForUpdate(data.startedAt),
        finishedAt: parseDateForUpdate(data.finishedAt),
        metadata: data.metadata,
      },
    });
  }

  async delete(id: string) {
    return prisma.sapNoteBatch.delete({
      where: { id },
    });
  }
}

export const sapNoteBatchesService = new SapNoteBatchesService();
