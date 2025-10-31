-- Initialize database
-- This script runs automatically when MySQL container starts

-- Set timezone
SET GLOBAL time_zone = '+08:00';

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS medical_cell_test
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- Use the database
USE medical_cell_test;

-- Grant privileges
GRANT ALL PRIVILEGES ON medical_cell_test.* TO 'app_user'@'%';
FLUSH PRIVILEGES;

-- Log initialization
SELECT 'Database medical_cell_test initialized successfully' AS message;
