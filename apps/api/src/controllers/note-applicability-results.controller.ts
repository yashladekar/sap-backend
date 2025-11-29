import type { Request, Response } from "express";
import { ZodError } from "zod";
import { noteApplicabilityResultsService } from "../services/note-applicability-results.service.js";
import {
  PaginationSchema,
  CreateNoteApplicabilityResultSchema,
  UpdateNoteApplicabilityResultSchema,
} from "../types/index.js";

export class NoteApplicabilityResultsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await noteApplicabilityResultsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid query parameters", details: error.errors });
        return;
      }
      console.error("Error fetching note applicability results:", error);
      res.status(500).json({ error: "Failed to fetch note applicability results" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const result = await noteApplicabilityResultsService.findById(id);

      if (!result) {
        res.status(404).json({ error: "Note applicability result not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching note applicability result:", error);
      res.status(500).json({ error: "Failed to fetch note applicability result" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateNoteApplicabilityResultSchema.parse(req.body);
      const result = await noteApplicabilityResultsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      console.error("Error creating note applicability result:", error);
      res.status(500).json({ error: "Failed to create note applicability result" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const data = UpdateNoteApplicabilityResultSchema.parse(req.body);
      const result = await noteApplicabilityResultsService.update(id, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Note applicability result not found" });
        return;
      }
      console.error("Error updating note applicability result:", error);
      res.status(500).json({ error: "Failed to update note applicability result" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      await noteApplicabilityResultsService.delete(id);
      res.json({ message: "Note applicability result deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Note applicability result not found" });
        return;
      }
      console.error("Error deleting note applicability result:", error);
      res.status(500).json({ error: "Failed to delete note applicability result" });
    }
  }
}

export const noteApplicabilityResultsController = new NoteApplicabilityResultsController();
