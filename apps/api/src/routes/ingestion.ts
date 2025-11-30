import { Router } from "express";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { TriggerBatchFetchSchema } from "../types/index.js";
import { sapNoteBatchesService } from "../services/sap-note-batches.service.js";
import { prisma } from "../lib/prisma.js"; // Import prisma directly for batch inserts

const router = Router();
const runCmd = promisify(exec);

router.post("/trigger-monthly-fetch", async (req, res) => {
    try {
        const { monthKey } = TriggerBatchFetchSchema.parse(req.body);

        // 1. Create Batch
        const batch = await sapNoteBatchesService.create({
            monthKey,
            notesFileS3: "local-fetch",
            status: "processing",
            startedAt: new Date().toISOString(),
            finishedAt: undefined,
            metadata: {},
        });

        try {
            // 2. Run MCP Tool and CAPTURE stdout
            // Ensure your MCP tool outputs JSON to stdout
            const { stdout } = await runCmd(
                `node /path/to/mcp-sap-notes/dist/mcp-server.js --batch-id ${batch.id} --month-key ${monthKey} --json`
            );

            // 3. Parse the Output
            const fetchedNotes = JSON.parse(stdout); // Expecting array of notes with validities

            // 4. Save to Database (Transaction)
            await prisma.$transaction(async (tx) => {
                for (const noteData of fetchedNotes) {
                    // Create the Note - noteId is the primary key
                    const createdNote = await tx.note.create({
                        data: {
                            noteId: noteData.noteNumber || noteData.noteId, // Support both field names from MCP
                            batchId: batch.id,
                            title: noteData.title,
                            category: noteData.category ?? null,
                            priority: noteData.priority ?? null,
                            cvss: noteData.cvssScore ?? noteData.cvss ?? null,
                            releasedOn: noteData.releasedOn ? new Date(noteData.releasedOn) : null,
                        }
                    });

                    // Create Validity Rules
                    if (noteData.validities && noteData.validities.length > 0) {
                        await tx.noteValidity.createMany({
                            data: noteData.validities.map((val: any) => ({
                                noteId: createdNote.noteId, // Use noteId as it's the primary key
                                component: val.component,
                                release: val.release,
                                minSpLevel: val.minSpLevel,
                                maxSpLevel: val.maxSpLevel
                            }))
                        });
                    }
                }
            });

            // 5. Mark Complete
            await sapNoteBatchesService.update(batch.id, {
                status: "completed",
                finishedAt: new Date().toISOString(),
            });

            res.json({ status: "Processing completed", batchId: batch.id, notesCount: fetchedNotes.length });

        } catch (err) {
            console.error("MCP fetch/save failed:", err);
            await sapNoteBatchesService.update(batch.id, {
                status: "failed",
                finishedAt: new Date().toISOString(),
            });
            res.status(500).json({ error: "MCP fetch failed" });
        }
    } catch (error) {
        console.error("Error triggering ingestion:", error);
        res.status(400).json({ error: "Invalid request" });
    }
});

export const ingestionRoutes: Router = router;