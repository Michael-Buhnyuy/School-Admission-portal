<?php
// Script to check table structure

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check users table structure
    echo "=== USERS TABLE STRUCTURE ===\n";
    $stmt = $pdo->query("DESCRIBE users");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    echo "\n=== ADMINS TABLE STRUCTURE ===\n";
    $stmt = $pdo->query("DESCRIBE admins");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    echo "\n=== ADMINS DATA ===\n";
    $stmt = $pdo->query("SELECT * FROM admins");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
    
} catch(PDOException $e) {
    echo "Error: ".$e->getMessage();
}
