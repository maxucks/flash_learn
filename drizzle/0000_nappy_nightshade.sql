CREATE TABLE `examples` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`usecase_id` integer NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `languages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`icon` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `relations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scope` text NOT NULL,
	`user_id` integer,
	`name` text NOT NULL,
	`direction` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "relations_scope_rules" CHECK((
        "relations"."scope" = 'app' AND "relations"."user_id" IS NULL
      ) OR (
        "relations"."scope" = 'user' AND "relations"."user_id" IS NOT NULL
      ))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `relations_name_unique` ON `relations` (`name`);--> statement-breakpoint
CREATE TABLE `usecase_notes` (
	`usecase_id` integer NOT NULL,
	`note_id` integer NOT NULL,
	PRIMARY KEY(`usecase_id`, `note_id`),
	FOREIGN KEY (`usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`note_id`) REFERENCES `notes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `usecases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`scope` text NOT NULL,
	`user_id` integer,
	`parent_id` integer,
	`img_url` text,
	`description` text,
	`translation` text,
	`rudeness` integer DEFAULT 0 NOT NULL,
	`formality` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`parent_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "usecase_scope_rules" CHECK((
        "usecases"."scope" = 'app'
        AND "usecases"."user_id" IS NULL
        AND "usecases"."parent_id" IS NULL
      ) OR (
        "usecases"."scope" = 'user'
        AND "usecases"."user_id" IS NOT NULL
      ))
);
--> statement-breakpoint
CREATE TABLE `usecases_relations` (
	`left_usecase_id` integer NOT NULL,
	`right_usecase_id` integer NOT NULL,
	`relation_id` integer NOT NULL,
	PRIMARY KEY(`left_usecase_id`, `right_usecase_id`, `relation_id`),
	FOREIGN KEY (`left_usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`right_usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`relation_id`) REFERENCES `relations`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE TABLE `vocabulary` (
	`user_id` integer NOT NULL,
	`usecase_id` integer NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`last_repetition_date` integer,
	`repetitions_count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`user_id`, `usecase_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "vocab_score_non_negative" CHECK("vocabulary"."score" >= 0),
	CONSTRAINT "vocab_reps_non_negative" CHECK("vocabulary"."repetitions_count" >= 0)
);
--> statement-breakpoint
CREATE INDEX `vocab_user_repetition_score_idx` ON `vocabulary` (`user_id`,`last_repetition_date`,`score`);--> statement-breakpoint
CREATE TABLE `words` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`language_id` integer NOT NULL,
	`value` text NOT NULL,
	FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `words_usecases` (
	`word_id` integer NOT NULL,
	`usecase_id` integer NOT NULL,
	`used_as` text,
	PRIMARY KEY(`word_id`, `usecase_id`),
	FOREIGN KEY (`word_id`) REFERENCES `words`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`usecase_id`) REFERENCES `usecases`(`id`) ON UPDATE no action ON DELETE cascade
);
