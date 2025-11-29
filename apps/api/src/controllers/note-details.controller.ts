import type { Request, Response } from "express";
import { ZodError } from "zod";
import { noteDetailsService } from "../services/note-details.service.js";
import {
  PaginationSchema,
  CreateNoteDetailSchema,
  UpdateNoteDetailSchema,
} from "../types/index.js";

export class NoteDetailsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await noteDetailsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid query parameters", details: error.errors });
        return;
      }
      console.error("Error fetching note details:", error);
      res.status(500).json({ error: "Failed to fetch note details" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const result = await noteDetailsService.findById(id);

      if (!result) {
        res.status(404).json({ error: "Note detail not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching note detail:", error);
      res.status(500).json({ error: "Failed to fetch note detail" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateNoteDetailSchema.parse(req.body);
      const result = await noteDetailsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      console.error("Error creating note detail:", error);
      res.status(500).json({ error: "Failed to create note detail" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const data = UpdateNoteDetailSchema.parse(req.body);
      const result = await noteDetailsService.update(id, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Note detail not found" });
        return;
      }
      console.error("Error updating note detail:", error);
      res.status(500).json({ error: "Failed to update note detail" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      await noteDetailsService.delete(id);
      res.json({ message: "Note detail deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Note detail not found" });
        return;
      }
      console.error("Error deleting note detail:", error);
      res.status(500).json({ error: "Failed to delete note detail" });
    }
  }
}

export const noteDetailsController = new NoteDetailsController();
