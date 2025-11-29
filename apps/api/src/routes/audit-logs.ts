import { Router } from "express";
import { auditLogsController } from "../controllers/audit-logs.controller.js";

const router = Router();

/**
 * GET /api/audit-logs - List all audit logs (with pagination)
 */
router.get("/", (req, res) => auditLogsController.findAll(req, res));

/**
 * GET /api/audit-logs/:id - Get audit log by ID
 */
router.get("/:id", (req, res) => auditLogsController.findById(req, res));

/**
 * POST /api/audit-logs - Create a new audit log
 */
router.post("/", (req, res) => auditLogsController.create(req, res));

/**
 * DELETE /api/audit-logs/:id - Delete audit log by ID
 */
router.delete("/:id", (req, res) => auditLogsController.delete(req, res));

export const auditLogsRoutes: Router = router;
