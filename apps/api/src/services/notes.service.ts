import { prisma } from "../lib/prisma.js";
import type {
  CreateNoteDto,
  UpdateNoteDto,
  PaginationParams,
} from "../types/index.js";

export class NotesService {
  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.note.findMany({
        skip,
        take: limit,
        orderBy: { fetchedAt: "desc" },
      }),
      prisma.note.count(),
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

  async findById(noteId: string) {
    return prisma.note.findUnique({
      where: { noteId },
      include: {
        noteDetails: true,
        sapBatchNotes: {
          include: {
            batch: true,
          },
        },
        noteApplicabilityResults: true,
      },
    });
  }

  async create(data: CreateNoteDto) {
    return prisma.note.create({
      data: {
        noteId: data.noteId,
        title: data.title,
        cvss: data.cvss,
        rawContentS3: data.rawContentS3,
        fetchedAt: data.fetchedAt ? new Date(data.fetchedAt) : undefined,
        metadata: data.metadata ?? undefined,
      },
    });
  }

  async update(noteId: string, data: UpdateNoteDto) {
    return prisma.note.update({
      where: { noteId },
      data: {
        title: data.title,
        cvss: data.cvss,
        rawContentS3: data.rawContentS3,
        fetchedAt: data.fetchedAt ? new Date(data.fetchedAt) : data.fetchedAt === null ? null : undefined,
        metadata: data.metadata,
      },
    });
  }

  async delete(noteId: string) {
    return prisma.note.delete({
      where: { noteId },
    });
  }
}

export const notesService = new NotesService();
