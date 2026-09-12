CREATE TABLE `biology_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`section` text NOT NULL,
	`simple` text NOT NULL,
	`technical` text DEFAULT '' NOT NULL,
	`confidence` text DEFAULT 'canon' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `canon_changes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`statement` text NOT NULL,
	`evidence` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'proposed' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`reviewed_at` text
);
--> statement-breakpoint
CREATE TABLE `glossary_terms` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`term` text NOT NULL,
	`simple` text NOT NULL,
	`canonical` text NOT NULL,
	`related` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `glossary_terms_term_unique` ON `glossary_terms` (`term`);--> statement-breakpoint
CREATE TABLE `lifecycle_stages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`stage` text NOT NULL,
	`stage_order` integer NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'unknown' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `species` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`ancestry` text NOT NULL,
	`scientific_name` text,
	`status` text DEFAULT 'established' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `veyra` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`name` text NOT NULL,
	`pigmentation` text DEFAULT 'Unknown' NOT NULL,
	`mechanism` text DEFAULT 'Unknown' NOT NULL,
	`prevalence` text DEFAULT 'Unknown' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visual_references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`species_id` text NOT NULL,
	`label` text NOT NULL,
	`stage` text NOT NULL,
	`sex` text DEFAULT 'Unspecified' NOT NULL,
	`veyra_name` text DEFAULT 'Unspecified' NOT NULL,
	`angle` text DEFAULT 'Unspecified' NOT NULL,
	`status` text DEFAULT 'experimental' NOT NULL
);
