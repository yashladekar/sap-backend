import type { Request, Response } from "express";
import { auditLogsService } from "../services/audit-logs.service.js";
import {
  PaginationSchema,
  CreateAuditLogSchema,
} from "../types/index.js";

export class AuditLogsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await auditLogsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid query parameters", details: error });
        return;
      }
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await auditLogsService.findById(id!);

      if (!result) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching audit log:", error);
      res.status(500).json({ error: "Failed to fetch audit log" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreateAuditLogSchema.parse(req.body);
      const result = await auditLogsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      console.error("Error creating audit log:", error);
      res.status(500).json({ error: "Failed to create audit log" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await auditLogsService.delete(id!);
      res.json({ message: "Audit log deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Audit log not found" });
        return;
      }
      console.error("Error deleting audit log:", error);
      res.status(500).json({ error: "Failed to delete audit log" });
    }
  }
}

export const auditLogsController = new AuditLogsController();
