import { Router } from "express";
import { clientComponentsController } from "../controllers/client-components.controller.js";

const router = Router();

/**
 * GET /api/client-components - List all client components (with pagination)
 */
router.get("/", (req, res) => clientComponentsController.findAll(req, res));

/**
 * GET /api/client-components/:id - Get client component by ID
 */
router.get("/:id", (req, res) => clientComponentsController.findById(req, res));

/**
 * POST /api/client-components - Create a new client component
 */
router.post("/", (req, res) => clientComponentsController.create(req, res));

/**
 * PUT /api/client-components/:id - Update client component by ID
 */
router.put("/:id", (req, res) => clientComponentsController.update(req, res));

/**
 * DELETE /api/client-components/:id - Delete client component by ID
 */
router.delete("/:id", (req, res) => clientComponentsController.delete(req, res));

export const clientComponentsRoutes: Router = router;
