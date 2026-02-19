<?php
// Fix database tables - add missing columns to admins table

$host = 'localhost';
$db = 'admission_portal';
$user_db = 'root';
$pass_db = '';

try { 
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user_db, $pass_db);   
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected\n";

    // Add name column if not exists
    try {
        $pdo->exec("ALTER TABLE admins ADD COLUMN name VARCHAR(255) NOT NULL AFTER password");
        echo "Added name\n";
    } catch(Exception $e){
        echo "Name: " . $e->getMessage() . "\n";
    }

} catch(PDOException $e){
    echo "Error: " . $e->getMessage() . "\n";
}
