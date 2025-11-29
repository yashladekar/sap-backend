import { Router } from "express";
import { notesController } from "../controllers/notes.controller.js";

const router = Router();

/**
 * GET /api/notes - List all notes (with pagination)
 */
router.get("/", (req, res) => notesController.findAll(req, res));

/**
 * GET /api/notes/:id - Get note by ID (noteId)
 */
router.get("/:id", (req, res) => notesController.findById(req, res));

/**
 * POST /api/notes - Create a new note
 */
router.post("/", (req, res) => notesController.create(req, res));

/**
 * PUT /api/notes/:id - Update note by ID (noteId)
 */
router.put("/:id", (req, res) => notesController.update(req, res));

/**
 * DELETE /api/notes/:id - Delete note by ID (noteId)
 */
router.delete("/:id", (req, res) => notesController.delete(req, res));

export const notesRoutes: Router = router;
