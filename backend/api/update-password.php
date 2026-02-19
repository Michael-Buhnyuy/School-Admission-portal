<?php
$pdo = new PDO("mysql:host=localhost;dbname=admission_portal", "root", "");
$hash = password_hash("admin123", PASSWORD_BCRYPT);
echo "Hash: $hash\n";
$stmt = $pdo->prepare("UPDATE admins SET password=? WHERE email=?");
$stmt->execute([$hash, "admin@school.com"]);
echo "Password updated!";
