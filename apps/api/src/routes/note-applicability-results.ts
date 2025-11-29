import { Router } from "express";
import { noteApplicabilityResultsController } from "../controllers/note-applicability-results.controller.js";

const router = Router();

/**
 * GET /api/note-applicability-results - List all note applicability results (with pagination)
 */
router.get("/", (req, res) => noteApplicabilityResultsController.findAll(req, res));

/**
 * GET /api/note-applicability-results/:id - Get note applicability result by ID
 */
router.get("/:id", (req, res) => noteApplicabilityResultsController.findById(req, res));

/**
 * POST /api/note-applicability-results - Create a new note applicability result
 */
router.post("/", (req, res) => noteApplicabilityResultsController.create(req, res));

/**
 * PUT /api/note-applicability-results/:id - Update note applicability result by ID
 */
router.put("/:id", (req, res) => noteApplicabilityResultsController.update(req, res));

/**
 * DELETE /api/note-applicability-results/:id - Delete note applicability result by ID
 */
router.delete("/:id", (req, res) => noteApplicabilityResultsController.delete(req, res));

export const noteApplicabilityResultsRoutes: Router = router;
