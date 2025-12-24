<?php
/**
 * Migration script to add project category field
 * 
 * This script adds the 'category' column to the projects table
 * to support categorizing projects as either 'CLIENT' or 'IN_HOUSE'
 */

// Database connection settings
$servername = 'localhost';
$username = 'cybaemtechin_agile';
$password = 'Agile@9090$';
$dbname = 'cybaemtechin_agile';

function runCategoryMigration($pdo) {
    try {
        echo "Starting project category migration...\n";
        
        // Check if category column already exists
        $checkQuery = "SHOW COLUMNS FROM projects LIKE 'category'";
        $result = $pdo->query($checkQuery);
        
        if ($result->rowCount() > 0) {
            echo "Category column already exists. Skipping migration.\n";
            return true;
        }
        
        // Begin transaction
        $pdo->beginTransaction();
        
        // Add category column
        echo "Adding category column to projects table...\n";
        $pdo->exec("ALTER TABLE projects 
                   ADD COLUMN category ENUM('CLIENT', 'IN_HOUSE') NOT NULL DEFAULT 'IN_HOUSE' 
                   AFTER description");
        
        // Add index for category field
        echo "Creating index for category field...\n";
        $pdo->exec("CREATE INDEX project_category_idx ON projects(category)");
        
        // Update existing projects to have default category
        echo "Setting default category for existing projects...\n";
        $updateResult = $pdo->exec("UPDATE projects SET category = 'IN_HOUSE' WHERE category IS NULL");
        echo "Updated {$updateResult} existing projects with default category.\n";
        
        // Commit transaction
        $pdo->commit();
        
        echo "Project category migration completed successfully!\n";
        return true;
        
    } catch (Exception $e) {
        // Rollback on error
        if ($pdo->inTransaction()) {
            $pdo->rollback();
        }
        
        echo "Migration failed: " . $e->getMessage() . "\n";
        return false;
    }
}

// Run the migration
try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    if (runCategoryMigration($pdo)) {
        echo "Migration completed successfully!\n";
        exit(0);
    } else {
        echo "Migration failed!\n";
        exit(1);
    }
    
} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>