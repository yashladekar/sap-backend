import { Router } from "express";
import { noteDetailsController } from "../controllers/note-details.controller.js";

const router = Router();

/**
 * GET /api/note-details - List all note details (with pagination)
 */
router.get("/", (req, res) => noteDetailsController.findAll(req, res));

/**
 * GET /api/note-details/:id - Get note detail by ID
 */
router.get("/:id", (req, res) => noteDetailsController.findById(req, res));

/**
 * POST /api/note-details - Create a new note detail
 */
router.post("/", (req, res) => noteDetailsController.create(req, res));

/**
 * PUT /api/note-details/:id - Update note detail by ID
 */
router.put("/:id", (req, res) => noteDetailsController.update(req, res));

/**
 * DELETE /api/note-details/:id - Delete note detail by ID
 */
router.delete("/:id", (req, res) => noteDetailsController.delete(req, res));

export const noteDetailsRoutes: Router = router;
