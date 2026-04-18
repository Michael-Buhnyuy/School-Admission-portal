-- Admission Dashboard Database Setup
-- Import this file via phpMyAdmin to create all tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS admission_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE admission_db;

-- Table 1: Applicants
CREATE TABLE IF NOT EXISTS applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 2: Applications
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    application_number VARCHAR(20) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    nationality VARCHAR(100),
    primary_school VARCHAR(255),
    primary_year VARCHAR(10),
    secondary_school VARCHAR(255) NOT NULL,
    secondary_year VARCHAR(10) NOT NULL,
    tertiary_institution VARCHAR(255),
    tertiary_course VARCHAR(255),
    selected_program VARCHAR(255),
    campus VARCHAR(100),
    intake VARCHAR(50),
    status ENUM('pending', 'under_review', 'approved', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_by INT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 3: OTP Verification
CREATE TABLE IF NOT EXISTS otp_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 4: Admins
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(20) UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admission_officer', 'reviewer', 'coordinator') DEFAULT 'admission_officer',
    department VARCHAR(100),
    phone VARCHAR(20),
    is_active TINYINT(1) DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 5: Admin Activity Log
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    entity_type VARCHAR(50),
    entity_id INT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert 4 Admin Users (Password: admin123)
INSERT INTO admins (admin_id, first_name, last_name, email, password_hash, role, department, phone, is_active) VALUES
('ADM000001', 'John', 'Smith', 'john.smith@admission.edu', '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i', 'super_admin', 'Administration', '+1234567890', 1),
('ADM000002', 'Sarah', 'Johnson', 'sarah.johnson@admission.edu', '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i', 'admission_officer', 'Admissions', '+1234567891', 1),
('ADM000003', 'Michael', 'Williams', 'michael.williams@admission.edu', '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i', 'reviewer', 'Admissions', '+1234567892', 1),
('ADM000004', 'Emily', 'Brown', 'emily.brown@admission.edu', '$2y$10$k2QyDe7KfTrxvH3xKhmwBuTMkaRdy2YE.hlBJRrOOqzLvQBCNYA3i', 'coordinator', 'Programs', '+1234567893', 1);

-- Table 6: Documents
CREATE TABLE IF NOT EXISTS documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NULL,
    applicant_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    type ENUM('passport_photo', 'transcript', 'certificate', 'identification', 'other') DEFAULT 'other',
    mime_type VARCHAR(100),
    size_bytes INT,
    status ENUM('pending', 'verified', 'flagged', 'rejected') DEFAULT 'pending',
    reviewed_by INT NULL,
    notes TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_applicant (applicant_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table 7: Messages (Enquiries + Conversations)
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    thread_id VARCHAR(50) NOT NULL,  -- Groups conversations
    sender_type ENUM('applicant', 'admin') NOT NULL,
    sender_id INT NOT NULL,
    recipient_type ENUM('applicant', 'admin') NOT NULL,
    recipient_id INT NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    attachment_path VARCHAR(500) NULL,
    is_read TINYINT(1) DEFAULT 0,
    status ENUM('sent', 'delivered', 'read', 'failed') DEFAULT 'sent',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_thread (thread_id),
    INDEX idx_sender (sender_type, sender_id),
    INDEX idx_recipient (recipient_type, recipient_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Prototype Sample Data (after admins)

-- Sample Applicants (password: applicant123)
INSERT INTO applicants (first_name, last_name, email, phone, password_hash, is_verified) VALUES
('Alice', 'Brown', 'alice.brown@email.com', '+15550101', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Michael', 'Chen', 'michael.chen@email.com', '+15550102', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
('Emma', 'Wilson', 'emma.wilson@email.com', '+15550103', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Sample Applications (linked to applicants 1-3)
INSERT INTO applications (applicant_id, application_number, first_name, last_name, email, phone, selected_program, status, secondary_school) VALUES
(1, 'APP0001', 'Alice', 'Brown', 'alice.brown@email.com', '+15550101', 'Computer Science', 'pending', 'Boston High School'),
(2, 'APP0002', 'Michael', 'Chen', 'michael.chen@email.com', '+15550102', 'Engineering', 'under_review', 'Cambridge High School'),
(3, 'APP0003', 'Emma', 'Wilson', 'emma.wilson@email.com', '+15550103', 'Business Administration', 'approved', 'Somerville High School');

-- Sample Documents (fake paths for prototype)
INSERT INTO documents (applicant_id, application_id, filename, original_name, file_path, type, status) VALUES
(1, 1, 'alice_transcript.pdf', 'High School Transcript - Alice Brown.pdf', '/uploads/documents/alice_transcript.pdf', 'transcript', 'verified'),
(1, 1, 'alice_photo.jpg', 'Passport Photo - Alice Brown.jpg', '/uploads/documents/alice_photo.jpg', 'passport_photo', 'pending'),
(2, 2, 'michael_cert.pdf', 'Graduation Certificate - Michael Chen.pdf', '/uploads/documents/michael_cert.pdf', 'certificate', 'flagged'),
(3, 3, 'emma_id.jpg', 'ID Card - Emma Wilson.jpg', '/uploads/documents/emma_id.jpg', 'identification', 'verified');

-- Sample Messages (thread_id groups conversations)
INSERT INTO messages (thread_id, sender_type, sender_id, recipient_type, recipient_id, subject, content) VALUES
('thread_1', 'applicant', 1, 'admin', 1, 'Question about Computer Science program', 'Hi, can you tell me more about the AI electives available?'),
('thread_1', 'admin', 1, 'applicant', 1, 'Re: Question about Computer Science program', 'Hi Alice, we offer Machine Learning, NLP, and Computer Vision electives.'),
('thread_2', 'applicant', 2, 'admin', 2, 'Document clarification needed', 'Regarding my graduation certificate - the date issue was due to school format.'),
('thread_3', 'admin', 2, 'applicant', 3, 'Application Approved!', 'Congratulations Emma! Your application has been approved.');

-- Show created tables
SHOW TABLES;
