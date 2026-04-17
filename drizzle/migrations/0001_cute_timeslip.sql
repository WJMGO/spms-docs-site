CREATE TABLE `performance_bonus_rules` (
	`id` varchar(36) NOT NULL,
	`criteria` varchar(255) NOT NULL,
	`min_points` int NOT NULL,
	`max_points` int NOT NULL,
	`description` text,
	`is_active` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_bonus_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_grade_rules` (
	`id` varchar(36) NOT NULL,
	`grade` varchar(50) NOT NULL,
	`min_score` decimal(5,2) NOT NULL,
	`max_score` decimal(5,2) NOT NULL,
	`percentage` decimal(5,2),
	`benefits` text,
	`description` text,
	`sort_order` int DEFAULT 0,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_grade_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_penalty_rules` (
	`id` varchar(36) NOT NULL,
	`criteria` varchar(255) NOT NULL,
	`min_points` int NOT NULL,
	`max_points` int NOT NULL,
	`description` text,
	`is_active` boolean DEFAULT true,
	`sort_order` int DEFAULT 0,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_penalty_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_rule_criteria` (
	`id` varchar(36) NOT NULL,
	`rule_id` varchar(36) NOT NULL,
	`level` varchar(100) NOT NULL,
	`score_range` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`examples` json,
	`sort_order` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_rule_criteria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_rule_versions` (
	`id` varchar(36) NOT NULL,
	`rule_type` varchar(50) NOT NULL,
	`version_number` int NOT NULL,
	`content` json NOT NULL,
	`change_description` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `performance_rule_versions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_rules` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`weight` int NOT NULL,
	`description` text,
	`is_active` boolean DEFAULT true,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_by` varchar(36),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `performance_rule_criteria` ADD CONSTRAINT `performance_rule_criteria_rule_id_performance_rules_id_fk` FOREIGN KEY (`rule_id`) REFERENCES `performance_rules`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_performance_bonus_rules_is_active` ON `performance_bonus_rules` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_performance_bonus_rules_created_by` ON `performance_bonus_rules` (`created_by`);--> statement-breakpoint
CREATE INDEX `idx_performance_grade_rules_created_by` ON `performance_grade_rules` (`created_by`);--> statement-breakpoint
CREATE INDEX `idx_performance_penalty_rules_is_active` ON `performance_penalty_rules` (`is_active`);--> statement-breakpoint
CREATE INDEX `idx_performance_penalty_rules_created_by` ON `performance_penalty_rules` (`created_by`);--> statement-breakpoint
CREATE INDEX `idx_performance_rule_criteria_rule_id` ON `performance_rule_criteria` (`rule_id`);--> statement-breakpoint
CREATE INDEX `idx_performance_rule_versions_rule_type` ON `performance_rule_versions` (`rule_type`);--> statement-breakpoint
CREATE INDEX `idx_performance_rule_versions_created_by` ON `performance_rule_versions` (`created_by`);--> statement-breakpoint
CREATE INDEX `idx_performance_rules_created_by` ON `performance_rules` (`created_by`);--> statement-breakpoint
CREATE INDEX `idx_performance_rules_is_active` ON `performance_rules` (`is_active`);