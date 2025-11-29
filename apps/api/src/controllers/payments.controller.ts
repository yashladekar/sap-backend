import type { Request, Response } from "express";
import { paymentsService } from "../services/payments.service.js";
import {
  PaginationSchema,
  CreatePaymentSchema,
  UpdatePaymentSchema,
} from "../types/index.js";

export class PaymentsController {
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagination = PaginationSchema.parse(req.query);
      const result = await paymentsService.findAll(pagination);
      res.json(result);
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid query parameters", details: error });
        return;
      }
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await paymentsService.findById(id!);

      if (!result) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      res.json({ data: result });
    } catch (error) {
      console.error("Error fetching payment:", error);
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = CreatePaymentSchema.parse(req.body);
      const result = await paymentsService.create(data);
      res.status(201).json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = UpdatePaymentSchema.parse(req.body);
      const result = await paymentsService.update(id!, data);
      res.json({ data: result });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request body", details: error });
        return;
      }
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      console.error("Error updating payment:", error);
      res.status(500).json({ error: "Failed to update payment" });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await paymentsService.delete(id!);
      res.json({ message: "Payment deleted successfully" });
    } catch (error) {
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }
      console.error("Error deleting payment:", error);
      res.status(500).json({ error: "Failed to delete payment" });
    }
  }
}

export const paymentsController = new PaymentsController();
