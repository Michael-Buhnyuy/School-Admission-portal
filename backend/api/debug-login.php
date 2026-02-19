<?php
// Debug script to check login logic

header("Content-Type: application/json");

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

$email = 'admin@school.com';
$password = 'admin123';

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // First check users table
    echo "=== Checking users table ===\n";
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        echo "Found user in users table:\n";
        print_r($user);
    } else {
        echo "Not found in users table\n";
    }
    
    // Check admins table
    echo "\n=== Checking admins table ===\n";
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($admin) {
        echo "Found admin in admins table:\n";
        print_r($admin);
        
        // Test password
        echo "\n=== Testing password ===\n";
        echo "Input password: $password\n";
        echo "Stored hash: " . $admin['password'] . "\n";
        $verify = password_verify($password, $admin['password']);
        echo "Password verify result: " . ($verify ? "TRUE" : "FALSE") . "\n";
    } else {
        echo "Not found in admins table\n";
    }
    
} catch(PDOException $e) {
    echo "Error: ".$e->getMessage();
}
