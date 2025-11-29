import type { Request, Response } from "express";
import { ZodError } from "zod";
import { clientComponentsService } from "../services/client-components.service.js";
import {
  PaginationSchema,
  CreateClientComponentSchema,
  UpdateClientComponentSchema,
} from "../types/index.js";

export class ClientComponentsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await clientComponentsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid query parameters", details: error.errors });
        return;
      }
      console.error("Error fetching client components:", error);
      res.status(500).json({ error: "Failed to fetch client components" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const result = await clientComponentsService.findById(id);

      if (!result) {
        res.status(404).json({ error: "Client component not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching client component:", error);
      res.status(500).json({ error: "Failed to fetch client component" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateClientComponentSchema.parse(req.body);
      const result = await clientComponentsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      console.error("Error creating client component:", error);
      res.status(500).json({ error: "Failed to create client component" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      const data = UpdateClientComponentSchema.parse(req.body);
      const result = await clientComponentsService.update(id, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: "Invalid request body", details: error.errors });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Client component not found" });
        return;
      }
      console.error("Error updating client component:", error);
      res.status(500).json({ error: "Failed to update client component" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({ error: "ID parameter is required" });
        return;
      }
      await clientComponentsService.delete(id);
      res.json({ message: "Client component deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Client component not found" });
        return;
      }
      console.error("Error deleting client component:", error);
      res.status(500).json({ error: "Failed to delete client component" });
    }
  }
}

export const clientComponentsController = new ClientComponentsController();
