import type { Request, Response } from "express";
import { ZodError } from "zod";
import { clientSystemsService } from "../services/client-systems.service.js";
import { PaginationSchema, CreateClientSystemSchema } from "../types/index.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";

export class ClientSystemsController {
    async findAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const pagination = PaginationSchema.parse(req.query);
            const result = await clientSystemsService.findAll(pagination, userId);
            res.json(result);
        } catch (error) {
            console.error("Error fetching client systems:", error);
            res.status(500).json({ error: "Failed to fetch client systems" });
        }
    }

    async findById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const id = req.params["id"];
            if (!id) {
                res.status(400).json({ error: "ID parameter is required" });
                return;
            }

            const result = await clientSystemsService.findById(id, userId);
            if (!result) {
                res.status(404).json({ error: "Client system not found" });
                return;
            }

            res.json({ data: result });
        } catch (error) {
            console.error("Error fetching client system:", error);
            res.status(500).json({ error: "Failed to fetch client system" });
        }
    }

    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const data = CreateClientSystemSchema.parse(req.body);
            const result = await clientSystemsService.create(userId, data);
            res.status(201).json({ data: result });
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({ error: "Invalid request body", details: error.errors });
                return;
            }
            console.error("Error creating client system:", error);
            res.status(500).json({ error: "Failed to create client system" });
        }
    }
}

export const clientSystemsController = new ClientSystemsController();
