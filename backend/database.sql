-- Database: admission_portal

-- Create database (run this first in MySQL)
-- CREATE DATABASE admission_portal;
-- USE admission_portal;

-- Table: users (for applicants)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    role ENUM('applicant') DEFAULT 'applicant',
    avatar VARCHAR(255),
    application_status ENUM('not_started', 'pending', 'approved', 'rejected') DEFAULT 'not_started',
    application_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: admins (for administrators)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    avatar VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (email: admin@school.com, password: admin123)
-- Note: The password is hashed using bcrypt
INSERT INTO admins (email, password, name, role, created_at, updated_at) 
VALUES ('admin@school.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', NOW(), NOW());

-- To verify: The hash above is for password 'admin123'
-- You can generate new hashes using: password_hash('yourpassword', PASSWORD_BCRYPT)

-- Show tables
-- SHOW TABLES;
