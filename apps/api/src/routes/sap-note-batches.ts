import { Router } from "express";
import { sapNoteBatchesController } from "../controllers/sap-note-batches.controller.js";

const router = Router();

/**
 * GET /api/sap-note-batches - List all SAP note batches (with pagination)
 */
router.get("/", (req, res) => sapNoteBatchesController.findAll(req, res));

/**
 * GET /api/sap-note-batches/:id - Get SAP note batch by ID
 */
router.get("/:id", (req, res) => sapNoteBatchesController.findById(req, res));

/**
 * POST /api/sap-note-batches - Create a new SAP note batch
 */
router.post("/", (req, res) => sapNoteBatchesController.create(req, res));

/**
 * PUT /api/sap-note-batches/:id - Update SAP note batch by ID
 */
router.put("/:id", (req, res) => sapNoteBatchesController.update(req, res));

/**
 * DELETE /api/sap-note-batches/:id - Delete SAP note batch by ID
 */
router.delete("/:id", (req, res) => sapNoteBatchesController.delete(req, res));

export const sapNoteBatchesRoutes: Router = router;
