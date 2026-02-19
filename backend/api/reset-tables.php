<?php
// Drop and recreate tables properly

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Drop and recreate admins table
    $pdo->exec("DROP TABLE IF EXISTS admins");
    $pdo->exec("CREATE TABLE admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL, 
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('admin','super_admin') DEFAULT 'admin',
        avatar VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    // Insert admin
    $hashedPassword = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
    $stmt = $pdo->prepare("INSERT INTO admins (email, password, name, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['admin@school.com', $hashedPassword, 'Admin User', 'admin']);
    
    echo "Admin table recreated and admin user inserted!";
    
} catch(PDOException $e) {
    echo "Error: ".$e->getMessage();
}
