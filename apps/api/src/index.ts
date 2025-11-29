import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { userRoutes } from "./routes/users.js";
import { adminRoutes } from "./routes/admin.js";
import { clientComponentsRoutes } from "./routes/client-components.js";
import { sapNoteBatchesRoutes } from "./routes/sap-note-batches.js";
import { runsRoutes } from "./routes/runs.js";
import { notesRoutes } from "./routes/notes.js";
import { noteDetailsRoutes } from "./routes/note-details.js";
import { noteApplicabilityResultsRoutes } from "./routes/note-applicability-results.js";
import { auditLogsRoutes } from "./routes/audit-logs.js";
import { paymentsRoutes } from "./routes/payments.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

// Security middleware
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);

// CORS configuration
app.use(
    cors({
        origin: [
            process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
            "http://localhost:3000",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    })
);

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth handler - handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/client-components", clientComponentsRoutes);
app.use("/api/sap-note-batches", sapNoteBatchesRoutes);
app.use("/api/runs", runsRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/note-details", noteDetailsRoutes);
app.use("/api/note-applicability-results", noteApplicabilityResultsRoutes);
app.use("/api/audit-logs", auditLogsRoutes);
app.use("/api/payments", paymentsRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use(
    (
        err: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
    ) => {
        console.error("Unhandled error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`📚 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`👤 Users API: http://localhost:${PORT}/api/users`);
    console.log(`🔧 Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`🔌 Client Components API: http://localhost:${PORT}/api/client-components`);
    console.log(`📦 SAP Note Batches API: http://localhost:${PORT}/api/sap-note-batches`);
    console.log(`🏃 Runs API: http://localhost:${PORT}/api/runs`);
    console.log(`📝 Notes API: http://localhost:${PORT}/api/notes`);
    console.log(`📋 Note Details API: http://localhost:${PORT}/api/note-details`);
    console.log(`✅ Note Applicability Results API: http://localhost:${PORT}/api/note-applicability-results`);
    console.log(`📊 Audit Logs API: http://localhost:${PORT}/api/audit-logs`);
    console.log(`💳 Payments API: http://localhost:${PORT}/api/payments`);
});

