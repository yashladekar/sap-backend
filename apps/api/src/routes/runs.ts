import { Router } from "express";
import { runsController } from "../controllers/runs.controller.js";

const router = Router();

/**
 * GET /api/runs - List all runs (with pagination)
 */
router.get("/", (req, res) => runsController.findAll(req, res));

/**
 * GET /api/runs/:id - Get run by ID
 */
router.get("/:id", (req, res) => runsController.findById(req, res));

/**
 * POST /api/runs - Create a new run
 */
router.post("/", (req, res) => runsController.create(req, res));

/**
 * PUT /api/runs/:id - Update run by ID
 */
router.put("/:id", (req, res) => runsController.update(req, res));

/**
 * DELETE /api/runs/:id - Delete run by ID
 */
router.delete("/:id", (req, res) => runsController.delete(req, res));

export const runsRoutes: Router = router;
