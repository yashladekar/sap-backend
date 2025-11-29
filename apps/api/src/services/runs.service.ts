import { prisma } from "../lib/prisma.js";
import type {
  CreateRunDto,
  UpdateRunDto,
  PaginationParams,
} from "../types/index.js";

export class RunsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.run.findMany({
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
        include: {
          batch: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      }),
      prisma.run.count(),
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
    return prisma.run.findUnique({
      where: { id },
      include: {
        batch: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        noteApplicabilityResults: true,
      },
    });
  }

  async create(data: CreateRunDto) {
    return prisma.run.create({
      data: {
        batchId: data.batchId,
        uploadedBy: data.uploadedBy,
        notesFileS3: data.notesFileS3,
        clientFileS3: data.clientFileS3,
        status: data.status,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        finishedAt: data.finishedAt ? new Date(data.finishedAt) : undefined,
      },
      include: {
        batch: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateRunDto) {
    return prisma.run.update({
      where: { id },
      data: {
        batchId: data.batchId,
        uploadedBy: data.uploadedBy,
        notesFileS3: data.notesFileS3,
        clientFileS3: data.clientFileS3,
        status: data.status,
        startedAt: data.startedAt ? new Date(data.startedAt) : data.startedAt === null ? null : undefined,
        finishedAt: data.finishedAt ? new Date(data.finishedAt) : data.finishedAt === null ? null : undefined,
      },
      include: {
        batch: true,
        user: {
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
    return prisma.run.delete({
      where: { id },
    });
  }
}

export const runsService = new RunsService();
