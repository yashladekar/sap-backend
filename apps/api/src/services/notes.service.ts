import { prisma } from "../lib/prisma.js";
import { Prisma } from "@workspace/database";
import type {
  CreateNoteDto,
  UpdateNoteDto,
  PaginationParams,
} from "../types/index.js";

// Type definitions for Note model
type NoteBase = {
  noteId: string;
  batchId: string;
  title: string;
  category: string | null;
  priority: string | null;
  cvss: number | null;
  releasedOn: Date | null;
  rawContentS3: string | null;
  fetchedAt: Date | null;
  metadata: Prisma.JsonValue;
};

type NoteWithBatch = NoteBase & {
  batch: {
    id: string;
    monthKey: string;
    notesFileS3: string | null;
    status: string;
    startedAt: Date | null;
    finishedAt: Date | null;
    metadata: Prisma.JsonValue;
    createdAt: Date;
    updatedAt: Date;
  };
};

type NoteValidity = {
  id: string;
  noteId: string;
  component: string;
  release: string;
  minSpLevel: number;
  maxSpLevel: number;
};

type ApplicabilityResult = {
  id: string;
  runId: string;
  noteId: string;
  status: string;
  reason: string | null;
};

function parseDateForUpdate(
  value: string | null | undefined
): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  return new Date(value);
}

export class NotesService {
  async findAll(params: PaginationParams): Promise<{
    data: Array<NoteWithBatch & { validities: NoteValidity[] }>;
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
      prisma.note.findMany({
        skip,
        take: limit,
        orderBy: { fetchedAt: "desc" },
        include: {
          batch: true,
          validities: true,
        },
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

  async findById(noteId: string): Promise<(NoteWithBatch & {
    validities: NoteValidity[];
    results: ApplicabilityResult[];
  }) | null> {
    return prisma.note.findUnique({
      where: { noteId },
      include: {
        batch: true,
        validities: true,
        results: true,
      },
    });
  }

  async create(data: CreateNoteDto): Promise<NoteBase> {
    return prisma.note.create({
      data: {
        noteId: data.noteId,
        batchId: data.batchId,
        title: data.title,
        cvss: data.cvss,
        rawContentS3: data.rawContentS3,
        fetchedAt: data.fetchedAt ? new Date(data.fetchedAt) : undefined,
        metadata: data.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async update(noteId: string, data: UpdateNoteDto): Promise<NoteBase> {
    return prisma.note.update({
      where: { noteId },
      data: {
        title: data.title,
        cvss: data.cvss,
        rawContentS3: data.rawContentS3,
        fetchedAt: parseDateForUpdate(data.fetchedAt),
        metadata: data.metadata === null
          ? Prisma.DbNull
          : (data.metadata as Prisma.InputJsonValue | undefined),
      },
    });
  }

  async delete(noteId: string): Promise<NoteBase> {
    return prisma.note.delete({
      where: { noteId },
    });
  }
}

export const notesService = new NotesService();
