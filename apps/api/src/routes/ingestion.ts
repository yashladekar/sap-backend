// apps/api/src/routes/ingestion.ts
import { Router } from "express";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { TriggerBatchFetchSchema } from "../types/index.js";
import { sapNoteBatchesService } from "../services/sap-note-batches.service.js";

const router = Router();
const runCmd = promisify(exec);

/**
 * POST /api/ingestion/trigger-monthly-fetch
 * Body: { monthKey: "2025-11" }
 */
router.post("/trigger-monthly-fetch", async (req, res) => {
    try {
        const { monthKey } = TriggerBatchFetchSchema.parse(req.body);

        // 1. Create a SapNoteBatch record in "processing" state
        const batch = await sapNoteBatchesService.create({
            monthKey,
            notesFileS3: "", // to be filled after MCP upload, if needed
            status: "processing",
            startedAt: new Date().toISOString(),
            finishedAt: undefined,
            metadata: {},
        });

        // 2. Call MCP CLI (adjust to your actual path/command)
        // Example:
        // node dist/mcp-server.js --batch-id <id> --month-key <monthKey>
        try {
            await runCmd(
                `node /full/path/to/mcp-sap-notes/dist/mcp-server.js --batch-id ${batch.id} --month-key ${monthKey}`
            );
        } catch (err) {
            console.error("MCP fetch failed:", err);
            await sapNoteBatchesService.update(batch.id, {
                status: "failed",
                finishedAt: new Date().toISOString(),
            });
            res.status(500).json({ error: "MCP fetch failed" });
            return;
        }

        // 3. Here you would:
        //    - Parse MCP output
        //    - Create Note + NoteValidity rows
        // For now just mark as completed.
        await sapNoteBatchesService.update(batch.id, {
            status: "completed",
            finishedAt: new Date().toISOString(),
        });

        res.json({ status: "Processing completed", batchId: batch.id });
    } catch (error) {
        console.error("Error triggering monthly MCP fetch:", error);
        res.status(400).json({ error: "Invalid request or MCP failure" });
    }
});

export const ingestionRoutes: Router = router;
