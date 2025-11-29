import type { Request, Response } from "express";
import { ZodError } from "zod";
import { runsService } from "../services/runs.service.js";
import {
  PaginationSchema,
  CreateRunSchema,
  UpdateRunSchema,
} from "../types/index.js";

export class RunsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await runsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid query parameters", details: error.errors });
        return;
      }
      console.error("Error fetching runs:", error);
      res.status(500).json({ error: "Failed to fetch runs" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const result = await runsService.findById(id);

      if (!result) {
        res.status(404).json({ error: "Run not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching run:", error);
      res.status(500).json({ error: "Failed to fetch run" });
    }
  }

  // in apps/api/src/controllers/runs.controller.ts
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateRunSchema.parse(req.body);
      const result = await runsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      console.error("Error creating run:", error);
      res.status(500).json({ error: "Failed to create run" });
    }
  }


  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const data = UpdateRunSchema.parse(req.body);
      const result = await runsService.update(id, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Run not found" });
        return;
      }
      console.error("Error updating run:", error);
      res.status(500).json({ error: "Failed to update run" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      await runsService.delete(id);
      res.json({ message: "Run deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Run not found" });
        return;
      }
      console.error("Error deleting run:", error);
      res.status(500).json({ error: "Failed to delete run" });
    }
  }
}

export const runsController = new RunsController();
