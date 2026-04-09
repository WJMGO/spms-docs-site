CREATE TABLE `assessment_items` (
	`id` varchar(36) NOT NULL,
	`template_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`weight` decimal(5,2) NOT NULL,
	`min_score` decimal(5,2) DEFAULT '0',
	`max_score` decimal(5,2) DEFAULT '100',
	`order` int NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_periods` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`status` varchar(50) DEFAULT 'draft',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_periods_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_scores` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`item_id` varchar(36) NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`remark` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_templates` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(50) NOT NULL,
	`total_score` decimal(5,2) DEFAULT '150',
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessment_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`action` varchar(100) NOT NULL,
	`resource` varchar(100) NOT NULL,
	`resource_id` varchar(36),
	`old_value` json,
	`new_value` json,
	`status` varchar(50) DEFAULT 'success',
	`error_message` text,
	`ip_address` varchar(45),
	`user_agent` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bonus_details` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`new_person_training_score` decimal(5,2) DEFAULT '0',
	`new_person_count` int DEFAULT 0,
	`new_person_month` int DEFAULT 0,
	`sharing_score` decimal(5,2) DEFAULT '0',
	`sharing_count` int DEFAULT 0,
	`patent_score` decimal(5,2) DEFAULT '0',
	`patent_proposal_passed` int DEFAULT 0,
	`patent_filing_passed` int DEFAULT 0,
	`document_score` decimal(5,2) DEFAULT '0',
	`document_count` int DEFAULT 0,
	`innovation_score` decimal(5,2) DEFAULT '0',
	`innovation_description` text,
	`team_atmosphere_score` decimal(5,2) DEFAULT '0',
	`team_atmosphere_count` int DEFAULT 0,
	`recruitment_score` decimal(5,2) DEFAULT '0',
	`recruitment_count` int DEFAULT 0,
	`praise_score` decimal(5,2) DEFAULT '0',
	`informal_praise_count` int DEFAULT 0,
	`formal_praise_personal` int DEFAULT 0,
	`formal_praise_team` int DEFAULT 0,
	`pl_score` decimal(5,2) DEFAULT '0',
	`pl_type` varchar(50),
	`total_score` decimal(5,2) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bonus_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `bonus_details_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
CREATE TABLE `department_review_details` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`team_delivery_score` decimal(5,2) DEFAULT '0',
	`team_collaboration_score` decimal(5,2) DEFAULT '0',
	`attitude_score` decimal(5,2) DEFAULT '0',
	`rank_percentile` decimal(5,2) DEFAULT '0',
	`total_score` decimal(5,2) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `department_review_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `department_review_details_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`manager_id` varchar(36),
	`parent_id` varchar(36),
	`level` int DEFAULT 0,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`employee_id` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`department_id` varchar(36) NOT NULL,
	`position_id` varchar(36) NOT NULL,
	`manager_id` varchar(36),
	`join_date` timestamp NOT NULL,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_user_id_unique` UNIQUE(`user_id`),
	CONSTRAINT `employees_employee_id_unique` UNIQUE(`employee_id`)
);
--> statement-breakpoint
CREATE TABLE `penalty_details` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`technical_error_amount` decimal(10,2) DEFAULT '0',
	`technical_error_severity` varchar(50),
	`technical_error_score` decimal(5,2) DEFAULT '0',
	`low_error_amount` decimal(10,2) DEFAULT '0',
	`low_error_severity` varchar(50),
	`low_error_score` decimal(5,2) DEFAULT '0',
	`software_testing_anomaly_count` int DEFAULT 0,
	`software_testing_anomaly_score` decimal(5,2) DEFAULT '0',
	`jenkins_compile_error_count` int DEFAULT 0,
	`jenkins_compile_error_score` decimal(5,2) DEFAULT '0',
	`code_review_anomaly_count` int DEFAULT 0,
	`code_review_anomaly_score` decimal(5,2) DEFAULT '0',
	`total_score` decimal(5,2) DEFAULT '0',
	`is_cleared` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `penalty_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `penalty_details_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
CREATE TABLE `performance_assessments` (
	`id` varchar(36) NOT NULL,
	`employee_id` varchar(36) NOT NULL,
	`period_id` varchar(36) NOT NULL,
	`template_id` varchar(36) NOT NULL,
	`evaluator_id` varchar(36) NOT NULL,
	`status` varchar(50) DEFAULT 'draft',
	`daily_work_score` decimal(5,2) DEFAULT '0',
	`work_quality_score` decimal(5,2) DEFAULT '0',
	`personal_goal_score` decimal(5,2) DEFAULT '0',
	`department_review_score` decimal(5,2) DEFAULT '0',
	`bonus_score` decimal(5,2) DEFAULT '0',
	`penalty_score` decimal(5,2) DEFAULT '0',
	`total_score` decimal(5,2),
	`rank` int,
	`comments` text,
	`submitted_at` timestamp,
	`approved_at` timestamp,
	`approved_by` varchar(36),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_assessments_id` PRIMARY KEY(`id`),
	CONSTRAINT `uk_assessment_employee_period_template` UNIQUE(`employee_id`,`period_id`,`template_id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`resource` varchar(100) NOT NULL,
	`action` varchar(100) NOT NULL,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`),
	CONSTRAINT `permissions_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `personal_goal_details` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`key_indicator_score` decimal(5,2) DEFAULT '0',
	`sprint_completion_rate` decimal(5,2) DEFAULT '0',
	`milestone_achievement_rate` decimal(5,2) DEFAULT '0',
	`key_matter_score` decimal(5,2) DEFAULT '0',
	`key_matter_description` text,
	`key_matter_completion_rate` decimal(5,2) DEFAULT '0',
	`total_score` decimal(5,2) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personal_goal_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `personal_goal_details_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`level` int NOT NULL,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_templates` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`type` varchar(50) NOT NULL,
	`sections` json,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `report_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` varchar(36) NOT NULL,
	`template_id` varchar(36) NOT NULL,
	`period_id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`data` json,
	`status` varchar(50) DEFAULT 'draft',
	`export_format` varchar(50),
	`exported_at` timestamp,
	`exported_by` varchar(36),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` varchar(36) NOT NULL,
	`permission_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `role_permissions_role_id_permission_id_pk` PRIMARY KEY(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` varchar(50) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` varchar(36) NOT NULL,
	`role_id` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `user_roles_user_id_role_id_pk` PRIMARY KEY(`user_id`,`role_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`open_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(20),
	`avatar` varchar(500),
	`role` varchar(50) DEFAULT 'employee',
	`status` varchar(50) DEFAULT 'active',
	`last_login_at` timestamp,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_open_id_unique` UNIQUE(`open_id`)
);
--> statement-breakpoint
CREATE TABLE `work_quality_details` (
	`id` varchar(36) NOT NULL,
	`assessment_id` varchar(36) NOT NULL,
	`code_review_count` int DEFAULT 0,
	`code_review_score` decimal(5,2) DEFAULT '0',
	`code_audit_count` int DEFAULT 0,
	`code_audit_score` decimal(5,2) DEFAULT '0',
	`bug_return_rate` decimal(5,2) DEFAULT '0',
	`bug_return_rate_score` decimal(5,2) DEFAULT '0',
	`personal_bug_count` int DEFAULT 0,
	`personal_bug_score` decimal(5,2) DEFAULT '0',
	`overdue_problems_achieved` boolean DEFAULT false,
	`overdue_problems_score` decimal(5,2) DEFAULT '0',
	`design_review_count` int DEFAULT 0,
	`design_review_score` decimal(5,2) DEFAULT '0',
	`total_score` decimal(5,2) DEFAULT '0',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `work_quality_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `work_quality_details_assessment_id_unique` UNIQUE(`assessment_id`)
);
--> statement-breakpoint
ALTER TABLE `assessment_items` ADD CONSTRAINT `assessment_items_template_id_assessment_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `assessment_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_scores` ADD CONSTRAINT `assessment_scores_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `assessment_scores` ADD CONSTRAINT `assessment_scores_item_id_assessment_items_id_fk` FOREIGN KEY (`item_id`) REFERENCES `assessment_items`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bonus_details` ADD CONSTRAINT `bonus_details_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `department_review_details` ADD CONSTRAINT `department_review_details_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departments` ADD CONSTRAINT `departments_manager_id_users_id_fk` FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `departments` ADD CONSTRAINT `departments_parent_id_departments_id_fk` FOREIGN KEY (`parent_id`) REFERENCES `departments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_position_id_positions_id_fk` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_manager_id_employees_id_fk` FOREIGN KEY (`manager_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `penalty_details` ADD CONSTRAINT `penalty_details_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_assessments` ADD CONSTRAINT `performance_assessments_employee_id_employees_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_assessments` ADD CONSTRAINT `performance_assessments_period_id_assessment_periods_id_fk` FOREIGN KEY (`period_id`) REFERENCES `assessment_periods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_assessments` ADD CONSTRAINT `performance_assessments_template_id_assessment_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `assessment_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_assessments` ADD CONSTRAINT `performance_assessments_evaluator_id_users_id_fk` FOREIGN KEY (`evaluator_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `performance_assessments` ADD CONSTRAINT `performance_assessments_approved_by_users_id_fk` FOREIGN KEY (`approved_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personal_goal_details` ADD CONSTRAINT `personal_goal_details_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_template_id_report_templates_id_fk` FOREIGN KEY (`template_id`) REFERENCES `report_templates`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_period_id_assessment_periods_id_fk` FOREIGN KEY (`period_id`) REFERENCES `assessment_periods`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_exported_by_users_id_fk` FOREIGN KEY (`exported_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `work_quality_details` ADD CONSTRAINT `work_quality_details_assessment_id_performance_assessments_id_fk` FOREIGN KEY (`assessment_id`) REFERENCES `performance_assessments`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_item_template` ON `assessment_items` (`template_id`);--> statement-breakpoint
CREATE INDEX `idx_period_status` ON `assessment_periods` (`status`);--> statement-breakpoint
CREATE INDEX `idx_period_date` ON `assessment_periods` (`start_date`,`end_date`);--> statement-breakpoint
CREATE INDEX `idx_score_assessment` ON `assessment_scores` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `idx_score_item` ON `assessment_scores` (`item_id`);--> statement-breakpoint
CREATE INDEX `idx_template_type` ON `assessment_templates` (`type`);--> statement-breakpoint
CREATE INDEX `idx_template_status` ON `assessment_templates` (`status`);--> statement-breakpoint
CREATE INDEX `idx_audit_user` ON `audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_audit_action` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_audit_resource` ON `audit_logs` (`resource`);--> statement-breakpoint
CREATE INDEX `idx_audit_created` ON `audit_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_bonus_assessment` ON `bonus_details` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `idx_department_review_assessment` ON `department_review_details` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `idx_dept_name` ON `departments` (`name`);--> statement-breakpoint
CREATE INDEX `idx_dept_status` ON `departments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_employee_id` ON `employees` (`employee_id`);--> statement-breakpoint
CREATE INDEX `idx_employee_dept` ON `employees` (`department_id`);--> statement-breakpoint
CREATE INDEX `idx_employee_status` ON `employees` (`status`);--> statement-breakpoint
CREATE INDEX `idx_penalty_assessment` ON `penalty_details` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `idx_assessment_employee` ON `performance_assessments` (`employee_id`);--> statement-breakpoint
CREATE INDEX `idx_assessment_period` ON `performance_assessments` (`period_id`);--> statement-breakpoint
CREATE INDEX `idx_assessment_status` ON `performance_assessments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_permission_name` ON `permissions` (`name`);--> statement-breakpoint
CREATE INDEX `idx_permission_resource_action` ON `permissions` (`resource`,`action`);--> statement-breakpoint
CREATE INDEX `idx_personal_goal_assessment` ON `personal_goal_details` (`assessment_id`);--> statement-breakpoint
CREATE INDEX `idx_position_name` ON `positions` (`name`);--> statement-breakpoint
CREATE INDEX `idx_position_level` ON `positions` (`level`);--> statement-breakpoint
CREATE INDEX `idx_report_template_type` ON `report_templates` (`type`);--> statement-breakpoint
CREATE INDEX `idx_report_template` ON `reports` (`template_id`);--> statement-breakpoint
CREATE INDEX `idx_report_period` ON `reports` (`period_id`);--> statement-breakpoint
CREATE INDEX `idx_report_status` ON `reports` (`status`);--> statement-breakpoint
CREATE INDEX `idx_role_permission_role` ON `role_permissions` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_role_permission_permission` ON `role_permissions` (`permission_id`);--> statement-breakpoint
CREATE INDEX `idx_role_name` ON `roles` (`name`);--> statement-breakpoint
CREATE INDEX `idx_user_role_user` ON `user_roles` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_user_role_role` ON `user_roles` (`role_id`);--> statement-breakpoint
CREATE INDEX `idx_open_id` ON `users` (`open_id`);--> statement-breakpoint
CREATE INDEX `idx_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `idx_work_quality_assessment` ON `work_quality_details` (`assessment_id`);