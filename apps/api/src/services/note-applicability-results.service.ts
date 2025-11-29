import { prisma } from "../lib/prisma.js";
import type {
  CreateNoteApplicabilityResultDto,
  UpdateNoteApplicabilityResultDto,
  PaginationParams,
} from "../types/index.js";

export class NoteApplicabilityResultsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.noteApplicabilityResult.findMany({
        skip,
        take: limit,
        include: {
          run: true,
          note: true,
          clientComponent: true,
        },
      }),
      prisma.noteApplicabilityResult.count(),
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
    return prisma.noteApplicabilityResult.findUnique({
      where: { id },
      include: {
        run: true,
        note: true,
        clientComponent: true,
      },
    });
  }

  async create(data: CreateNoteApplicabilityResultDto) {
    return prisma.noteApplicabilityResult.create({
      data: {
        runId: data.runId,
        noteId: data.noteId,
        clientComponentId: data.clientComponentId,
        component: data.component,
        clientVersion: data.clientVersion,
        applicable: data.applicable,
        confidenceScore: data.confidenceScore,
        reason: data.reason,
      },
      include: {
        run: true,
        note: true,
        clientComponent: true,
      },
    });
  }

  async update(id: string, data: UpdateNoteApplicabilityResultDto) {
    return prisma.noteApplicabilityResult.update({
      where: { id },
      data: {
        runId: data.runId,
        noteId: data.noteId,
        clientComponentId: data.clientComponentId,
        component: data.component,
        clientVersion: data.clientVersion,
        applicable: data.applicable,
        confidenceScore: data.confidenceScore,
        reason: data.reason,
      },
      include: {
        run: true,
        note: true,
        clientComponent: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.noteApplicabilityResult.delete({
      where: { id },
    });
  }
}

export const noteApplicabilityResultsService = new NoteApplicabilityResultsService();
