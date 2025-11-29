// import { z } from "zod";

// // ============================================
// // Pagination
// // ============================================
// export const PaginationSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(100).default(10),
// });

// export type PaginationParams = z.infer<typeof PaginationSchema>;

// export interface PaginatedResponse<T> {
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// // ============================================
// // ClientComponent Schemas
// // ============================================
// export const CreateClientComponentSchema = z.object({
//   name: z.string().min(1).max(255),
//   installedVersion: z.string().min(1).max(100),
//   kernelVersion: z.string().min(1).max(100),
//   metadata: z.record(z.unknown()).optional(),
// });

// export const UpdateClientComponentSchema = z.object({
//   name: z.string().min(1).max(255).optional(),
//   installedVersion: z.string().min(1).max(100).optional(),
//   kernelVersion: z.string().min(1).max(100).optional(),
//   metadata: z.record(z.unknown()).optional().nullable(),
// });

// export type CreateClientComponentDto = z.infer<typeof CreateClientComponentSchema>;
// export type UpdateClientComponentDto = z.infer<typeof UpdateClientComponentSchema>;

// // ============================================
// // SapNoteBatch Schemas
// // ============================================
// export const CreateSapNoteBatchSchema = z.object({
//   monthKey: z.string().min(1).max(50),
//   notesFileS3: z.string().min(1).max(500),
//   status: z.string().min(1).max(50),
//   startedAt: z.string().datetime().optional(),
//   finishedAt: z.string().datetime().optional(),
//   metadata: z.record(z.unknown()).optional(),
// });

// export const UpdateSapNoteBatchSchema = z.object({
//   monthKey: z.string().min(1).max(50).optional(),
//   notesFileS3: z.string().min(1).max(500).optional(),
//   status: z.string().min(1).max(50).optional(),
//   startedAt: z.string().datetime().optional().nullable(),
//   finishedAt: z.string().datetime().optional().nullable(),
//   metadata: z.record(z.unknown()).optional().nullable(),
// });

// export type CreateSapNoteBatchDto = z.infer<typeof CreateSapNoteBatchSchema>;
// export type UpdateSapNoteBatchDto = z.infer<typeof UpdateSapNoteBatchSchema>;

// // ============================================
// // Run Schemas
// // ============================================


// export const UpdateRunSchema = z.object({
//   batchId: z.string().uuid().optional(),
//   uploadedBy: z.string().uuid().optional(),
//   notesFileS3: z.string().min(1).max(500).optional(),
//   clientFileS3: z.string().min(1).max(500).optional(),
//   status: z.string().min(1).max(50).optional(),
//   startedAt: z.string().datetime().optional().nullable(),
//   finishedAt: z.string().datetime().optional().nullable(),
// });


// export type UpdateRunDto = z.infer<typeof UpdateRunSchema>;

// // ============================================
// // Note Schemas
// // ============================================
// export const CreateNoteSchema = z.object({
//   noteId: z.string().min(1).max(100),
//   title: z.string().min(1).max(500),
//   cvss: z.number().min(0).max(10).optional(),
//   rawContentS3: z.string().min(1).max(500),
//   fetchedAt: z.string().datetime().optional(),
//   metadata: z.record(z.unknown()).optional(),
// });

// export const UpdateNoteSchema = z.object({
//   title: z.string().min(1).max(500).optional(),
//   cvss: z.number().min(0).max(10).optional().nullable(),
//   rawContentS3: z.string().min(1).max(500).optional(),
//   fetchedAt: z.string().datetime().optional().nullable(),
//   metadata: z.record(z.unknown()).optional().nullable(),
// });

// export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
// export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;

// // ============================================
// // NoteDetail Schemas
// // ============================================
// export const CreateNoteDetailSchema = z.object({
//   noteId: z.string().min(1).max(100),
//   componentPattern: z.string().min(1).max(255),
//   affectedRange: z.string().min(1).max(255),
//   solutionSummary: z.string().max(2000).optional(),
//   workaroundSummary: z.string().max(2000).optional(),
//   rawSectionS3: z.string().max(500).optional(),
//   lastParsedAt: z.string().datetime().optional(),
// });

// export const UpdateNoteDetailSchema = z.object({
//   noteId: z.string().min(1).max(100).optional(),
//   componentPattern: z.string().min(1).max(255).optional(),
//   affectedRange: z.string().min(1).max(255).optional(),
//   solutionSummary: z.string().max(2000).optional().nullable(),
//   workaroundSummary: z.string().max(2000).optional().nullable(),
//   rawSectionS3: z.string().max(500).optional().nullable(),
//   lastParsedAt: z.string().datetime().optional().nullable(),
// });

// export type CreateNoteDetailDto = z.infer<typeof CreateNoteDetailSchema>;
// export type UpdateNoteDetailDto = z.infer<typeof UpdateNoteDetailSchema>;

// // ============================================
// // NoteApplicabilityResult Schemas
// // ============================================
// export const CreateNoteApplicabilityResultSchema = z.object({
//   runId: z.string().uuid(),
//   noteId: z.string().min(1).max(100),
//   clientComponentId: z.string().uuid(),
//   component: z.string().min(1).max(255),
//   clientVersion: z.string().min(1).max(100),
//   applicable: z.string().min(1).max(50),
//   confidenceScore: z.number().min(0).max(1).optional(),
//   reason: z.string().max(1000).optional(),
// });

// export const UpdateNoteApplicabilityResultSchema = z.object({
//   runId: z.string().uuid().optional(),
//   noteId: z.string().min(1).max(100).optional(),
//   clientComponentId: z.string().uuid().optional(),
//   component: z.string().min(1).max(255).optional(),
//   clientVersion: z.string().min(1).max(100).optional(),
//   applicable: z.string().min(1).max(50).optional(),
//   confidenceScore: z.number().min(0).max(1).optional().nullable(),
//   reason: z.string().max(1000).optional().nullable(),
// });

// export type CreateNoteApplicabilityResultDto = z.infer<typeof CreateNoteApplicabilityResultSchema>;
// export type UpdateNoteApplicabilityResultDto = z.infer<typeof UpdateNoteApplicabilityResultSchema>;

// // ============================================
// // AuditLog Schemas
// // ============================================
// export const CreateAuditLogSchema = z.object({
//   actorId: z.string().uuid(),
//   action: z.string().min(1).max(100),
//   details: z.string().max(2000).optional(),
// });

// export type CreateAuditLogDto = z.infer<typeof CreateAuditLogSchema>;

// // ============================================
// // Payment Schemas
// // ============================================
// export const CreatePaymentSchema = z.object({
//   userId: z.string().uuid(),
//   provider: z.string().min(1).max(50),
//   providerPaymentId: z.string().min(1).max(255),
//   amount: z.number().positive(),
//   currency: z.string().length(3).regex(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code (e.g., USD, EUR)"),
//   status: z.string().min(1).max(50),
// });

// export const UpdatePaymentSchema = z.object({
//   provider: z.string().min(1).max(50).optional(),
//   providerPaymentId: z.string().min(1).max(255).optional(),
//   amount: z.number().positive().optional(),
//   currency: z.string().length(3).regex(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code (e.g., USD, EUR)").optional(),
//   status: z.string().min(1).max(50).optional(),
// });

// export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
// export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;

// // ============================================
// // SapBatchNote Schemas (Junction Table)
// // ============================================
// export const CreateSapBatchNoteSchema = z.object({
//   batchId: z.string().uuid(),
//   noteId: z.string().min(1).max(100),
// });

// export type CreateSapBatchNoteDto = z.infer<typeof CreateSapBatchNoteSchema>;



// // ============================================
// // Client System Schemas
// // ============================================
// export const CreateClientSystemSchema = z.object({
//   name: z.string().min(1),
//   systemId: z.string().min(1), // SAP SID
//   components: z.array(
//     z.object({
//       name: z.string().min(1),        // "SAP_BASIS"
//       release: z.string().min(1),     // "750"
//       supportPackage: z.string().min(1).optional(), // "SAPK-75005INSAPBASIS"
//       spLevel: z.number().int().min(0),             // parsed SP level
//     })
//   ),
// });

// export type CreateClientSystemDto = z.infer<typeof CreateClientSystemSchema>;

// // ============================================
// // Run Schemas (NEW - analysis oriented)
// // ============================================
// export const CreateRunSchema = z.object({
//   systemId: z.string().uuid(),   // ClientSystem.id
//   batchId: z.string().uuid(),    // SapNoteBatch.id
//   uploadedBy: z.string().uuid(), // User.id (who triggered)
// });

// export type CreateRunDto = z.infer<typeof CreateRunSchema>;

// // ============================================
// // Note Validity Schemas (for ingestion/parsing)
// // ============================================
// export const CreateNoteValiditySchema = z.object({
//   noteId: z.string().min(1),
//   component: z.string().min(1),
//   release: z.string().min(1),
//   minSpLevel: z.number().int().min(0),
//   maxSpLevel: z.number().int().min(0),
// });

// export type CreateNoteValidityDto = z.infer<typeof CreateNoteValiditySchema>;

// export const TriggerBatchFetchSchema = z.object({
//   monthKey: z.string().regex(/^\d{4}-\d{2}$/, "Expected format YYYY-MM"),
// });

// export type TriggerBatchFetchDto = z.infer<typeof TriggerBatchFetchSchema>;



import { z } from "zod";

// ============================================
// Pagination
// ============================================
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// ClientComponent Schemas
// ============================================
export const CreateClientComponentSchema = z.object({
  name: z.string().min(1).max(255),
  installedVersion: z.string().min(1).max(100),
  kernelVersion: z.string().min(1).max(100),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateClientComponentSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  installedVersion: z.string().min(1).max(100).optional(),
  kernelVersion: z.string().min(1).max(100).optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type CreateClientComponentDto = z.infer<typeof CreateClientComponentSchema>;
export type UpdateClientComponentDto = z.infer<typeof UpdateClientComponentSchema>;

// ============================================
// SapNoteBatch Schemas
// ============================================
export const CreateSapNoteBatchSchema = z.object({
  monthKey: z.string().min(1).max(50),
  notesFileS3: z.string().min(1).max(500),
  status: z.string().min(1).max(50),
  startedAt: z.string().datetime().optional(),
  finishedAt: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateSapNoteBatchSchema = z.object({
  monthKey: z.string().min(1).max(50).optional(),
  notesFileS3: z.string().min(1).max(500).optional(),
  status: z.string().min(1).max(50).optional(),
  startedAt: z.string().datetime().optional().nullable(),
  finishedAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type CreateSapNoteBatchDto = z.infer<typeof CreateSapNoteBatchSchema>;
export type UpdateSapNoteBatchDto = z.infer<typeof UpdateSapNoteBatchSchema>;

// ============================================
// Run Schemas
// ============================================


export const UpdateRunSchema = z.object({
  batchId: z.string().uuid().optional(),
  uploadedBy: z.string().uuid().optional(),
  notesFileS3: z.string().min(1).max(500).optional(),
  clientFileS3: z.string().min(1).max(500).optional(),
  status: z.string().min(1).max(50).optional(),
  startedAt: z.string().datetime().optional().nullable(),
  finishedAt: z.string().datetime().optional().nullable(),
});


export type UpdateRunDto = z.infer<typeof UpdateRunSchema>;

// ============================================
// Note Schemas
// ============================================
export const CreateNoteSchema = z.object({
  noteId: z.string().min(1).max(100),
  title: z.string().min(1).max(500),
  cvss: z.number().min(0).max(10).optional(),
  rawContentS3: z.string().min(1).max(500),
  fetchedAt: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  cvss: z.number().min(0).max(10).optional().nullable(),
  rawContentS3: z.string().min(1).max(500).optional(),
  fetchedAt: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type CreateNoteDto = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteDto = z.infer<typeof UpdateNoteSchema>;

// ============================================
// NoteDetail Schemas
// ============================================
export const CreateNoteDetailSchema = z.object({
  noteId: z.string().min(1).max(100),
  componentPattern: z.string().min(1).max(255),
  affectedRange: z.string().min(1).max(255),
  solutionSummary: z.string().max(2000).optional(),
  workaroundSummary: z.string().max(2000).optional(),
  rawSectionS3: z.string().max(500).optional(),
  lastParsedAt: z.string().datetime().optional(),
});

export const UpdateNoteDetailSchema = z.object({
  noteId: z.string().min(1).max(100).optional(),
  componentPattern: z.string().min(1).max(255).optional(),
  affectedRange: z.string().min(1).max(255).optional(),
  solutionSummary: z.string().max(2000).optional().nullable(),
  workaroundSummary: z.string().max(2000).optional().nullable(),
  rawSectionS3: z.string().max(500).optional().nullable(),
  lastParsedAt: z.string().datetime().optional().nullable(),
});

export type CreateNoteDetailDto = z.infer<typeof CreateNoteDetailSchema>;
export type UpdateNoteDetailDto = z.infer<typeof UpdateNoteDetailSchema>;

// ============================================
// NoteApplicabilityResult Schemas
// ============================================
export const CreateNoteApplicabilityResultSchema = z.object({
  runId: z.string().uuid(),
  noteId: z.string().min(1).max(100),
  clientComponentId: z.string().uuid(),
  component: z.string().min(1).max(255),
  clientVersion: z.string().min(1).max(100),
  applicable: z.string().min(1).max(50),
  confidenceScore: z.number().min(0).max(1).optional(),
  reason: z.string().max(1000).optional(),
});

export const UpdateNoteApplicabilityResultSchema = z.object({
  runId: z.string().uuid().optional(),
  noteId: z.string().min(1).max(100).optional(),
  clientComponentId: z.string().uuid().optional(),
  component: z.string().min(1).max(255).optional(),
  clientVersion: z.string().min(1).max(100).optional(),
  applicable: z.string().min(1).max(50).optional(),
  confidenceScore: z.number().min(0).max(1).optional().nullable(),
  reason: z.string().max(1000).optional().nullable(),
});

export type CreateNoteApplicabilityResultDto = z.infer<typeof CreateNoteApplicabilityResultSchema>;
export type UpdateNoteApplicabilityResultDto = z.infer<typeof UpdateNoteApplicabilityResultSchema>;

// ============================================
// AuditLog Schemas
// ============================================
export const CreateAuditLogSchema = z.object({
  actorId: z.string().uuid(),
  action: z.string().min(1).max(100),
  details: z.string().max(2000).optional(),
});

export type CreateAuditLogDto = z.infer<typeof CreateAuditLogSchema>;

// ============================================
// Payment Schemas
// ============================================
export const CreatePaymentSchema = z.object({
  userId: z.string().uuid(),
  provider: z.string().min(1).max(50),
  providerPaymentId: z.string().min(1).max(255),
  amount: z.number().positive(),
  currency: z.string().length(3).regex(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code (e.g., USD, EUR)"),
  status: z.string().min(1).max(50),
});

export const UpdatePaymentSchema = z.object({
  provider: z.string().min(1).max(50).optional(),
  providerPaymentId: z.string().min(1).max(255).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).regex(/^[A-Z]{3}$/, "Currency must be a valid ISO 4217 code (e.g., USD, EUR)").optional(),
  status: z.string().min(1).max(50).optional(),
});

export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema>;

// ============================================
// SapBatchNote Schemas (Junction Table)
// ============================================
export const CreateSapBatchNoteSchema = z.object({
  batchId: z.string().uuid(),
  noteId: z.string().min(1).max(100),
});

export type CreateSapBatchNoteDto = z.infer<typeof CreateSapBatchNoteSchema>;



// ============================================
// Client System Schemas
// ============================================
export const CreateClientSystemSchema = z.object({
  name: z.string().min(1),
  systemId: z.string().min(1), // SAP SID
  components: z.array(
    z.object({
      name: z.string().min(1),        // "SAP_BASIS"
      release: z.string().min(1),     // "750"
      supportPackage: z.string().min(1).optional(), // "SAPK-75005INSAPBASIS"
      spLevel: z.number().int().min(0),             // parsed SP level
    })
  ),
});

export type CreateClientSystemDto = z.infer<typeof CreateClientSystemSchema>;

// ============================================
// Run Schemas (NEW - analysis oriented)
// ============================================
export const CreateRunSchema = z.object({
  systemId: z.string().uuid(),   // ClientSystem.id
  batchId: z.string().uuid(),    // SapNoteBatch.id
  uploadedBy: z.string().uuid(), // User.id (who triggered)
});

export type CreateRunDto = z.infer<typeof CreateRunSchema>;

// ============================================
// Note Validity Schemas (for ingestion/parsing)
// ============================================
export const CreateNoteValiditySchema = z.object({
  noteId: z.string().min(1),
  component: z.string().min(1),
  release: z.string().min(1),
  minSpLevel: z.number().int().min(0),
  maxSpLevel: z.number().int().min(0),
});

export type CreateNoteValidityDto = z.infer<typeof CreateNoteValiditySchema>;

export const TriggerBatchFetchSchema = z.object({
  monthKey: z.string().regex(/^\d{4}-\d{2}$/, "Expected format YYYY-MM"),
});

export type TriggerBatchFetchDto = z.infer<typeof TriggerBatchFetchSchema>;
