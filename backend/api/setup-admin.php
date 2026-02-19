<?php
// Simple script to setup initial data

header("Content-Type: application/json");

// Database configuration  
$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

try {
    // First connect without db to create it if needed
    $pdo_no_db = new PDO("mysql:host=$host", $user_db, '');
    $pdo_no_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists  
    $pdo_no_db->exec("CREATE DATABASE IF NOT EXISTS `$db`");
    
} catch (PDOException $e) {
}

// Now connect WITH db  
try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

   // Create users table   
   $pdo->exec("
CREATE TABLE IF NOT EXISTS users (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
full_name VARCHAR(255) NOT NULL,
phone VARCHAR(20),
date_of_birth DATE,
role ENUM('applicant') DEFAULT 'applicant',
avatar VARCHAR(255),
application_status ENUM('not_started','pending','') DEFAULT 'notapproved','rejected_started',
application_id INT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");

   // Admins table  
   $pdo->exec(
"CREATE TABLE IF NOT EXISTS admins (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL, 
password VARCHAR(255) NOT NULL,
name VARCHAR(255) NOT NULL,
role ENUM('admin','super_admin') DEFAULT 'admin',
avatar VARCHAR(255),
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");

   // Insert default admin  
   $hashedPassword = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
   
   $stmt = $pdo->prepare("INSERT IGNORE INTO admins (email, password, name, role) VALUES (:email, :password, :name, :role)");
   $stmt->execute([':email'=>'admin@school.com', ':password'=>$hashedPassword, ':name'=>'Admin User', ':role'=>'admin']);

   echo json_encode(["success"=>true,"message"=>"Database setup complete. Admin user created."]);

 } catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error'=>'Failed: '.$e->getMessage()]);
    exit();
}
