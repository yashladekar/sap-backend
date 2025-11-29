import type { Request, Response } from "express";
import { sapNoteBatchesService } from "../services/sap-note-batches.service.js";
import {
  PaginationSchema,
  CreateSapNoteBatchSchema,
  UpdateSapNoteBatchSchema,
} from "../types/index.js";

export class SapNoteBatchesController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await sapNoteBatchesService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid query parameters", details: error });
        return;
      }
      console.error("Error fetching SAP note batches:", error);
      res.status(500).json({ error: "Failed to fetch SAP note batches" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await sapNoteBatchesService.findById(id!);

      if (!result) {
        res.status(404).json({ error: "SAP note batch not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching SAP note batch:", error);
      res.status(500).json({ error: "Failed to fetch SAP note batch" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateSapNoteBatchSchema.parse(req.body);
      const result = await sapNoteBatchesService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      console.error("Error creating SAP note batch:", error);
      res.status(500).json({ error: "Failed to create SAP note batch" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = UpdateSapNoteBatchSchema.parse(req.body);
      const result = await sapNoteBatchesService.update(id!, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "SAP note batch not found" });
        return;
      }
      console.error("Error updating SAP note batch:", error);
      res.status(500).json({ error: "Failed to update SAP note batch" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await sapNoteBatchesService.delete(id!);
      res.json({ message: "SAP note batch deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "SAP note batch not found" });
        return;
      }
      console.error("Error deleting SAP note batch:", error);
      res.status(500).json({ error: "Failed to delete SAP note batch" });
    }
  }
}

export const sapNoteBatchesController = new SapNoteBatchesController();
