CREATE TABLE `intelligence_runs` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`operation` text NOT NULL,`profile` text NOT NULL,`provider` text NOT NULL,`model` text DEFAULT '' NOT NULL,`status` text NOT NULL,`duration_ms` integer DEFAULT 0 NOT NULL,`request_id` text,`usage_json` text DEFAULT '{}' NOT NULL,`error_category` text,`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `intelligence_run_status_idx` ON `intelligence_runs` (`status`,`created_at`);
--> statement-breakpoint
CREATE TABLE `visual_failures` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`species_id` text NOT NULL,`asset_id` integer,`category` text NOT NULL,`description` text NOT NULL,`resolution` text DEFAULT '' NOT NULL,`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `visual_failure_species_idx` ON `visual_failures` (`species_id`,`created_at`);
--> statement-breakpoint
CREATE TABLE `visual_lineage` (`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,`source_asset_id` integer NOT NULL,`target_asset_id` integer NOT NULL,`relationship` text NOT NULL,`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL);
--> statement-breakpoint
CREATE INDEX `visual_lineage_source_idx` ON `visual_lineage` (`source_asset_id`);
--> statement-breakpoint
CREATE INDEX `visual_lineage_target_idx` ON `visual_lineage` (`target_asset_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `biology_search_idx` ON `biology_records` (`species_id`,`section`,`confidence`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `glossary_search_idx` ON `glossary_terms` (`term`);
--> statement-breakpoint
PRAGMA optimize;
