// apps/api/src/services/runs.service.ts
import { prisma } from "../lib/prisma.js";
import type { CreateRunDto, UpdateRunDto, PaginationParams } from "../types/index.js";

export class RunsService {
  async findAll(params: PaginationParams): Promise<{
    data: any[];
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
      prisma.run.findMany({
        skip,
        take: limit,
        orderBy: { startedAt: "desc" },
        include: {
          system: true,
          batch: true,
          user: {
            select: { id: true, email: true, name: true },
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

  async findById(id: string): Promise<any> {
    return prisma.run.findUnique({
      where: { id },
      include: {
        system: {
          include: { components: true },
        },
        batch: true,
        user: {
          select: { id: true, email: true, name: true },
        },
        results: {
          include: { note: true },
        },
      },
    });
  }

  /**
   * Creates a Run and kicks off the analysis engine.
   * For now we run synchronously; later you can offload to a queue/worker.
   */
  async create(data: CreateRunDto) {
    const run = await prisma.run.create({
      data: {
        systemId: data.systemId,
        batchId: data.batchId,
        uploadedBy: data.uploadedBy,
        status: "analyzing",
        startedAt: new Date(),
      },
      include: {
        system: true,
        batch: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Execute analysis (blocking version)
    await this.executeAnalysis(run.id, run.systemId, run.batchId);

    // Reload run with results
    return this.findById(run.id);
  }

  /**
   * Core matching algorithm:
   * - Load InstalledComponents for the system
   * - Load Notes + their NoteValidities for the batch
   * - Compare component+release+SP-range
   * - Store ApplicabilityResult rows
   */
  private async executeAnalysis(runId: string, systemId: string, batchId: string) {
    try {
      // 1. Client state
      const installedComponents = await prisma.installedComponent.findMany({
        where: { systemId },
      });

      // 2. Notes + validity rules
      const notes = await prisma.note.findMany({
        where: { batchId },
        include: { validities: true },
      });

      const resultsData: {
        runId: string;
        noteId: string;
        status: string;
        reason?: string;
      }[] = [];

      for (const note of notes) {
        let isApplicable = false;
        let reason = "No matching component found";

        for (const rule of note.validities) {
          const match = installedComponents.find(
            (c) => c.name === rule.component && c.release === rule.release
          );

          if (!match) continue;

          if (match.spLevel >= rule.minSpLevel && match.spLevel <= rule.maxSpLevel) {
            isApplicable = true;
            reason = `Matched ${rule.component} ${rule.release}: client SP ${match.spLevel} in [${rule.minSpLevel}, ${rule.maxSpLevel}]`;
            break;
          } else {
            reason = `Component found but SP ${match.spLevel} outside [${rule.minSpLevel}, ${rule.maxSpLevel}]`;
          }
        }

        if (isApplicable) {
          resultsData.push({
            runId,
            noteId: note.noteId,
            status: "APPLICABLE",
            reason,
          });
        } else {
          // optional: save NOT_APPLICABLE rows if you want full matrix
          // resultsData.push({ runId, noteId: note.noteId, status: "NOT_APPLICABLE", reason });
        }
      }

      if (resultsData.length > 0) {
        await prisma.applicabilityResult.createMany({ data: resultsData });
      }

      await prisma.run.update({
        where: { id: runId },
        data: {
          status: "completed",
          finishedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("SAP Note analysis failed", error);
      await prisma.run.update({
        where: { id: runId },
        data: { status: "failed", finishedAt: new Date() },
      });
    }
  }

  /**
   * Update a run's status or other fields
   */
  async update(id: string, data: UpdateRunDto): Promise<any> {
    return prisma.run.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.finishedAt && { finishedAt: new Date(data.finishedAt) }),
      },
      include: {
        system: true,
        batch: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  /**
   * Delete a run and its associated results
   */
  async delete(id: string): Promise<any> {
    // Results are deleted via cascade
    return prisma.run.delete({
      where: { id },
    });
  }
}

export const runsService = new RunsService();
