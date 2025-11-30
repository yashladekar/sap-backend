import { Router } from "express";
import { clientSystemsController } from "../controllers/client-systems.controller.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/client-systems - List all systems for current user
 */
router.get("/", requireAuth, (req: AuthenticatedRequest, res) =>
    clientSystemsController.findAll(req, res)
);

/**
 * GET /api/client-systems/:id - Get system by ID
 */
router.get("/:id", requireAuth, (req: AuthenticatedRequest, res) =>
    clientSystemsController.findById(req, res)
);

/**
 * POST /api/client-systems - Upload a new system + components
 */
router.post("/", requireAuth, (req: AuthenticatedRequest, res) =>
    clientSystemsController.create(req, res)
);

export const clientSystemsRoutes: Router = router;
