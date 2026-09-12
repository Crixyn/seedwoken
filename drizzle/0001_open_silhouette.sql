CREATE TABLE `knowledge_imports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`status` text DEFAULT 'review' NOT NULL,
	`summary_json` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text
);
--> statement-breakpoint
CREATE INDEX `knowledge_import_status_idx` ON `knowledge_imports` (`status`);--> statement-breakpoint
CREATE TABLE `knowledge_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_id` integer NOT NULL,
	`species_id` text,
	`entity_type` text NOT NULL,
	`entity_key` text NOT NULL,
	`field` text NOT NULL,
	`simple` text NOT NULL,
	`technical` text DEFAULT '' NOT NULL,
	`canon_status` text DEFAULT 'reference' NOT NULL,
	`review_state` text DEFAULT 'matched' NOT NULL,
	`fingerprint` text NOT NULL,
	`superseded_by` integer,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `knowledge_record_fingerprint_idx` ON `knowledge_records` (`fingerprint`);--> statement-breakpoint
CREATE INDEX `knowledge_record_entity_idx` ON `knowledge_records` (`species_id`,`entity_type`,`entity_key`);--> statement-breakpoint
CREATE INDEX `knowledge_record_review_idx` ON `knowledge_records` (`review_state`);--> statement-breakpoint
CREATE TABLE `knowledge_sources` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source_type` text NOT NULL,
	`identity` text NOT NULL,
	`title` text NOT NULL,
	`source_date` text,
	`source_version` text,
	`canon_status` text DEFAULT 'reference' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `knowledge_source_identity_idx` ON `knowledge_sources` (`source_type`,`identity`);--> statement-breakpoint
CREATE TABLE `visual_assets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`title` text NOT NULL,
	`asset_type` text DEFAULT 'reference' NOT NULL,
	`asset_url` text,
	`thumbnail_url` text,
	`stage` text DEFAULT 'Unspecified' NOT NULL,
	`sex` text DEFAULT 'Unspecified' NOT NULL,
	`veyra_name` text DEFAULT 'Unspecified' NOT NULL,
	`view` text DEFAULT 'Unspecified' NOT NULL,
	`reference_type` text DEFAULT 'design reference' NOT NULL,
	`canon_status` text DEFAULT 'experimental' NOT NULL,
	`generation` text DEFAULT '' NOT NULL,
	`version` text DEFAULT '1' NOT NULL,
	`source_id` integer,
	`features` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`rejection_reason` text DEFAULT '' NOT NULL,
	`parent_id` integer,
	`superseded_by` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visual_filter_idx` ON `visual_assets` (`species_id`,`stage`,`sex`,`canon_status`);--> statement-breakpoint
CREATE INDEX `visual_parent_idx` ON `visual_assets` (`parent_id`);--> statement-breakpoint
CREATE TABLE `visual_specifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`name` text NOT NULL,
	`anatomy` text DEFAULT '' NOT NULL,
	`tissue` text DEFAULT '' NOT NULL,
	`pigmentation` text DEFAULT '' NOT NULL,
	`stage` text DEFAULT 'Unspecified' NOT NULL,
	`sex` text DEFAULT 'Unspecified' NOT NULL,
	`veyra_name` text DEFAULT 'Unspecified' NOT NULL,
	`camera` text DEFAULT '' NOT NULL,
	`lighting` text DEFAULT '' NOT NULL,
	`background` text DEFAULT '' NOT NULL,
	`prohibited` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `visual_spec_species_idx` ON `visual_specifications` (`species_id`,`status`);--> statement-breakpoint
PRAGMA optimize;
