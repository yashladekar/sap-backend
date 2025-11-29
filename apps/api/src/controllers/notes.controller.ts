import type { Request, Response } from "express";
import { notesService } from "../services/notes.service.js";
import {
  PaginationSchema,
  CreateNoteSchema,
  UpdateNoteSchema,
} from "../types/index.js";

export class NotesController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await notesService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid query parameters", details: error });
        return;
      }
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await notesService.findById(id!);

      if (!result) {
        res.status(404).json({ error: "Note not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching note:", error);
      res.status(500).json({ error: "Failed to fetch note" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateNoteSchema.parse(req.body);
      const result = await notesService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = UpdateNoteSchema.parse(req.body);
      const result = await notesService.update(id!, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await notesService.delete(id!);
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Note not found" });
        return;
      }
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  }
}

export const notesController = new NotesController();
