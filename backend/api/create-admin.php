<?php
// Simple script to insert admin user

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Insert default admin  
    $hashedPassword = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
   
    $stmt = $pdo->prepare("INSERT IGNORE INTO admins (email, password, name, role) VALUES (:email, :password, :name, :role)");
    $stmt->execute([':email'=>'admin@school.com', ':password'=>$hashedPassword, ':name'=>'Admin User', ':role'=>'admin']);

    echo "Admin user created successfully!";
    
} catch(PDOException $e) {
    echo "Error: ".$e->getMessage();
}
