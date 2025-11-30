import { prisma } from "../lib/prisma.js";
import type {
  CreateSapNoteBatchDto,
  UpdateSapNoteBatchDto,
  PaginationParams,
} from "../types/index.js";

function parseDateForUpdate(
  value: string | null | undefined
): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

export class SapNoteBatchesService {
  async findAll(params: PaginationParams): Promise<{
    data: Array<{
      id: string;
      monthKey: string;
      notesFileS3: string | null;
      status: string;
      startedAt: Date | null;
      finishedAt: Date | null;
      metadata: any;
      createdAt: Date;
      updatedAt: Date;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
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

  async findById(id: string): Promise<{
    id: string;
    monthKey: string;
    notesFileS3: string | null;
    status: string;
    startedAt: Date | null;
    finishedAt: Date | null;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
    notes: Array<{
      noteId: string;
      batchId: string;
      title: string;
      category: string | null;
      priority: string | null;
      cvss: number | null;
      releasedOn: Date | null;
      rawContentS3: string | null;
      fetchedAt: Date | null;
      metadata: any;
      validities: Array<{
        id: string;
        noteId: string;
        component: string;
        release: string;
        minSpLevel: number;
        maxSpLevel: number;
      }>;
      results: Array<{
        id: string;
        runId: string;
        noteId: string;
        status: string;
        reason: string | null;
      }>;
    }>;
    runs: Array<{
      id: string;
      systemId: string;
      batchId: string;
      uploadedBy: string;
      status: string;
      startedAt: Date;
      finishedAt: Date | null;
    }>;
  } | null> {
    return prisma.sapNoteBatch.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            validities: true,
            results: true,
          },
        },
        runs: true,
      },
    });
  }

  async create(data: CreateSapNoteBatchDto): Promise<{
    id: string;
    monthKey: string;
    notesFileS3: string | null;
    status: string;
    startedAt: Date | null;
    finishedAt: Date | null;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return prisma.sapNoteBatch.create({
      data: {
        monthKey: data.monthKey,
        notesFileS3: data.notesFileS3,
        status: data.status,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        finishedAt: data.finishedAt ? new Date(data.finishedAt) : undefined,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
      },
    });
  }

  async update(
    id: string,
    data: UpdateSapNoteBatchDto
  ): Promise<{
    id: string;
    monthKey: string;
    notesFileS3: string | null;
    status: string;
    startedAt: Date | null;
    finishedAt: Date | null;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return prisma.sapNoteBatch.update({
      where: { id },
      data: {
        monthKey: data.monthKey,
        notesFileS3: data.notesFileS3,
        status: data.status,
        startedAt: parseDateForUpdate(data.startedAt),
        finishedAt: parseDateForUpdate(data.finishedAt),
        metadata:
          data.metadata === null
            ? undefined
            : data.metadata !== undefined
              ? JSON.stringify(data.metadata)
              : undefined,
      },
    });
  }

  async delete(id: string): Promise<{ id: string; monthKey: string; notesFileS3: string | null; status: string; startedAt: Date | null; finishedAt: Date | null; metadata: any; createdAt: Date; updatedAt: Date }> {
    return prisma.sapNoteBatch.delete({
      where: { id },
    });
  }
}

export const sapNoteBatchesService = new SapNoteBatchesService();
