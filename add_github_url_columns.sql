-- Add github_url column to projects table
ALTER TABLE `projects` 
ADD COLUMN `github_url` VARCHAR(255) DEFAULT NULL 
COMMENT 'GitHub repository URL for the project';

-- Add github_url column to work_items table  
ALTER TABLE `work_items` 
ADD COLUMN `github_url` VARCHAR(255) DEFAULT NULL 
COMMENT 'GitHub repository URL (used for EPIC items)';

-- Add indexes for better performance
ALTER TABLE `projects` ADD INDEX `idx_github_url` (`github_url`);
ALTER TABLE `work_items` ADD INDEX `idx_github_url` (`github_url`);