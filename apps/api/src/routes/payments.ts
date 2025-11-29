import { Router } from "express";
import { paymentsController } from "../controllers/payments.controller.js";

const router = Router();

/**
 * GET /api/payments - List all payments (with pagination)
 */
router.get("/", (req, res) => paymentsController.findAll(req, res));

/**
 * GET /api/payments/:id - Get payment by ID
 */
router.get("/:id", (req, res) => paymentsController.findById(req, res));

/**
 * POST /api/payments - Create a new payment
 */
router.post("/", (req, res) => paymentsController.create(req, res));

/**
 * PUT /api/payments/:id - Update payment by ID
 */
router.put("/:id", (req, res) => paymentsController.update(req, res));

/**
 * DELETE /api/payments/:id - Delete payment by ID
 */
router.delete("/:id", (req, res) => paymentsController.delete(req, res));

export const paymentsRoutes: Router = router;
