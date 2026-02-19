<?php
// Fix admin password

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "New hash: $hash\n\n";

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Update password
    $stmt = $pdo->prepare("UPDATE admins SET password=? WHERE email=?");
    $stmt->execute([$hash, 'admin@school.com']);
    echo "Updated admin password\n";

    // Verify
    $stmt2 = $pdo->query("SELECT password FROM admins WHERE email='admin@school.com'");
    $row = $stmt2->fetch(PDO::FETCH_ASSOC);
    echo "Stored: " . $row['password'] . "\n";
    
    $result = password_verify($password, $row['password']);
    echo "Verify: " . ($result ? "OK" : "FAIL") . "\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
