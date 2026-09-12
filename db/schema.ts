import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const species = sqliteTable("species", { id: text("id").primaryKey(), name: text("name").notNull(), ancestry: text("ancestry").notNull(), scientificName: text("scientific_name"), status: text("status").notNull().default("established"), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`) });
export const biologyRecords = sqliteTable("biology_records", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), section: text("section").notNull(), simple: text("simple").notNull(), technical: text("technical").notNull().default(""), confidence: text("confidence").notNull().default("canon") });
export const lifecycleStages = sqliteTable("lifecycle_stages", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), stage: text("stage").notNull(), stageOrder: integer("stage_order").notNull(), notes: text("notes").notNull().default(""), status: text("status").notNull().default("unknown") });
export const veyra = sqliteTable("veyra", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), name: text("name").notNull(), pigmentation: text("pigmentation").notNull().default("Unknown"), mechanism: text("mechanism").notNull().default("Unknown"), prevalence: text("prevalence").notNull().default("Unknown") });
export const visualReferences = sqliteTable("visual_references", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), label: text("label").notNull(), stage: text("stage").notNull(), sex: text("sex").notNull().default("Unspecified"), veyraName: text("veyra_name").notNull().default("Unspecified"), angle: text("angle").notNull().default("Unspecified"), status: text("status").notNull().default("experimental") });
export const glossaryTerms = sqliteTable("glossary_terms", { id: integer("id").primaryKey({ autoIncrement: true }), term: text("term").notNull().unique(), simple: text("simple").notNull(), canonical: text("canonical").notNull(), related: text("related").notNull().default("") });
export const canonChanges = sqliteTable("canon_changes", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), statement: text("statement").notNull(), evidence: text("evidence").notNull().default(""), status: text("status").notNull().default("proposed"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), reviewedAt: text("reviewed_at") });

export const knowledgeSources = sqliteTable("knowledge_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceType: text("source_type").notNull(),
  identity: text("identity").notNull(),
  title: text("title").notNull(),
  sourceDate: text("source_date"),
  sourceVersion: text("source_version"),
  canonStatus: text("canon_status").notNull().default("reference"),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [uniqueIndex("knowledge_source_identity_idx").on(t.sourceType, t.identity)]);

export const knowledgeRecords = sqliteTable("knowledge_records", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("source_id").notNull(),
  speciesId: text("species_id"),
  entityType: text("entity_type").notNull(),
  entityKey: text("entity_key").notNull(),
  field: text("field").notNull(),
  simple: text("simple").notNull(),
  technical: text("technical").notNull().default(""),
  canonStatus: text("canon_status").notNull().default("reference"),
  reviewState: text("review_state").notNull().default("matched"),
  fingerprint: text("fingerprint").notNull(),
  supersededBy: integer("superseded_by"),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [uniqueIndex("knowledge_record_fingerprint_idx").on(t.fingerprint), index("knowledge_record_entity_idx").on(t.speciesId, t.entityType, t.entityKey), index("knowledge_record_review_idx").on(t.reviewState)]);

export const knowledgeImports = sqliteTable("knowledge_imports", {
  id: integer("id").primaryKey({ autoIncrement: true }), sourceId: integer("source_id").notNull(),
  status: text("status").notNull().default("review"), summaryJson: text("summary_json").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`), reviewedAt: text("reviewed_at"),
}, (t) => [index("knowledge_import_status_idx").on(t.status)]);

export const visualAssets = sqliteTable("visual_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(),
  title: text("title").notNull(), assetType: text("asset_type").notNull().default("reference"), assetUrl: text("asset_url"), thumbnailUrl: text("thumbnail_url"),
  stage: text("stage").notNull().default("Unspecified"), sex: text("sex").notNull().default("Unspecified"), veyraName: text("veyra_name").notNull().default("Unspecified"), view: text("view").notNull().default("Unspecified"),
  referenceType: text("reference_type").notNull().default("design reference"), canonStatus: text("canon_status").notNull().default("experimental"), generation: text("generation").notNull().default(""), version: text("version").notNull().default("1"),
  sourceId: integer("source_id"), features: text("features").notNull().default(""), notes: text("notes").notNull().default(""), rejectionReason: text("rejection_reason").notNull().default(""),
  parentId: integer("parent_id"), supersededBy: integer("superseded_by"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("visual_filter_idx").on(t.speciesId, t.stage, t.sex, t.canonStatus), index("visual_parent_idx").on(t.parentId)]);

export const visualSpecifications = sqliteTable("visual_specifications", {
  id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), name: text("name").notNull(),
  anatomy: text("anatomy").notNull().default(""), tissue: text("tissue").notNull().default(""), pigmentation: text("pigmentation").notNull().default(""),
  stage: text("stage").notNull().default("Unspecified"), sex: text("sex").notNull().default("Unspecified"), veyraName: text("veyra_name").notNull().default("Unspecified"),
  camera: text("camera").notNull().default(""), lighting: text("lighting").notNull().default(""), background: text("background").notNull().default(""), prohibited: text("prohibited").notNull().default(""),
  status: text("status").notNull().default("draft"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("visual_spec_species_idx").on(t.speciesId, t.status)]);

export const intelligenceRuns = sqliteTable("intelligence_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }), operation: text("operation").notNull(), profile: text("profile").notNull(), provider: text("provider").notNull(), model: text("model").notNull().default(""), status: text("status").notNull(), durationMs: integer("duration_ms").notNull().default(0), requestId: text("request_id"), usageJson: text("usage_json").notNull().default("{}"), errorCategory: text("error_category"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => [index("intelligence_run_status_idx").on(t.status, t.createdAt)]);
export const visualFailures = sqliteTable("visual_failures", { id: integer("id").primaryKey({ autoIncrement: true }), speciesId: text("species_id").notNull(), assetId: integer("asset_id"), category: text("category").notNull(), description: text("description").notNull(), resolution: text("resolution").notNull().default(""), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) }, (t) => [index("visual_failure_species_idx").on(t.speciesId, t.createdAt)]);
export const visualLineage = sqliteTable("visual_lineage", { id: integer("id").primaryKey({ autoIncrement: true }), sourceAssetId: integer("source_asset_id").notNull(), targetAssetId: integer("target_asset_id").notNull(), relationship: text("relationship").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`) }, (t) => [index("visual_lineage_source_idx").on(t.sourceAssetId), index("visual_lineage_target_idx").on(t.targetAssetId)]);
