import { prisma } from "../lib/prisma.js";
import type {
  CreateNoteDetailDto,
  UpdateNoteDetailDto,
  PaginationParams,
} from "../types/index.js";

export class NoteDetailsService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.noteDetail.findMany({
        skip,
        take: limit,
        orderBy: { lastParsedAt: "desc" },
        include: {
          note: true,
        },
      }),
      prisma.noteDetail.count(),
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
    return prisma.noteDetail.findUnique({
      where: { id },
      include: {
        note: true,
      },
    });
  }

  async create(data: CreateNoteDetailDto) {
    return prisma.noteDetail.create({
      data: {
        noteId: data.noteId,
        componentPattern: data.componentPattern,
        affectedRange: data.affectedRange,
        solutionSummary: data.solutionSummary,
        workaroundSummary: data.workaroundSummary,
        rawSectionS3: data.rawSectionS3,
        lastParsedAt: data.lastParsedAt ? new Date(data.lastParsedAt) : undefined,
      },
      include: {
        note: true,
      },
    });
  }

  async update(id: string, data: UpdateNoteDetailDto) {
    return prisma.noteDetail.update({
      where: { id },
      data: {
        noteId: data.noteId,
        componentPattern: data.componentPattern,
        affectedRange: data.affectedRange,
        solutionSummary: data.solutionSummary,
        workaroundSummary: data.workaroundSummary,
        rawSectionS3: data.rawSectionS3,
        lastParsedAt: data.lastParsedAt ? new Date(data.lastParsedAt) : data.lastParsedAt === null ? null : undefined,
      },
      include: {
        note: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.noteDetail.delete({
      where: { id },
    });
  }
}

export const noteDetailsService = new NoteDetailsService();
