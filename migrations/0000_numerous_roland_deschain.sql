CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`start_at` text NOT NULL,
	`end_at` text NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	CONSTRAINT "events_valid_time" CHECK("events"."start_at" < "events"."end_at")
);
--> statement-breakpoint
CREATE INDEX `events_start_at_idx` ON `events` (`start_at`);--> statement-breakpoint
CREATE INDEX `events_end_at_idx` ON `events` (`end_at`);--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` text PRIMARY KEY NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`remind_at` text NOT NULL,
	`sent_at` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	CONSTRAINT "reminders_valid_target" CHECK("reminders"."target_type" IN ('schedule', 'task', 'event')),
	CONSTRAINT "reminders_valid_status" CHECK("reminders"."status" IN ('pending', 'processing', 'sent', 'failed', 'cancelled')),
	CONSTRAINT "reminders_valid_attempts" CHECK("reminders"."attempts" >= 0)
);
--> statement-breakpoint
CREATE INDEX `reminders_status_time_idx` ON `reminders` (`status`,`remind_at`);--> statement-breakpoint
CREATE INDEX `reminders_target_idx` ON `reminders` (`target_type`,`target_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reminders_unique_idx` ON `reminders` (`target_type`,`target_id`,`remind_at`);--> statement-breakpoint
CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`subject_id` text NOT NULL,
	`day_of_week` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`room` text NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "schedules_valid_day" CHECK("schedules"."day_of_week" BETWEEN 0 AND 6),
	CONSTRAINT "schedules_valid_time" CHECK("schedules"."start_time" < "schedules"."end_time")
);
--> statement-breakpoint
CREATE INDEX `schedules_subject_id_idx` ON `schedules` (`subject_id`);--> statement-breakpoint
CREATE INDEX `schedules_day_time_idx` ON `schedules` (`day_of_week`,`start_time`);--> statement-breakpoint
CREATE UNIQUE INDEX `schedules_unique_idx` ON `schedules` (`subject_id`,`day_of_week`,`start_time`,`end_time`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_idx` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `sessions_expires_at_idx` ON `sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `subjects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`lecturer` text NOT NULL,
	`color` text DEFAULT '#3b82f6' NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subjects_name_idx` ON `subjects` (lower(trim("name")));--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`subject_id` text,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`deadline` text NOT NULL,
	`priority` text DEFAULT 'medium' NOT NULL,
	`status` text DEFAULT 'todo' NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "tasks_valid_priority" CHECK("tasks"."priority" IN ('low', 'medium', 'high')),
	CONSTRAINT "tasks_valid_status" CHECK("tasks"."status" IN ('todo', 'in_progress', 'done'))
);
--> statement-breakpoint
CREATE INDEX `tasks_subject_id_idx` ON `tasks` (`subject_id`);--> statement-breakpoint
CREATE INDEX `tasks_deadline_idx` ON `tasks` (`deadline`);--> statement-breakpoint
CREATE INDEX `tasks_status_deadline_idx` ON `tasks` (`status`,`deadline`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL,
	`updated_at` text DEFAULT 
  (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);