<?php
/**
 * ADMISSION DASHBOARD API - Fixed & Complete v1.0
 * Standalone PHP API for admission dashboard frontend
 * Run with: php -S localhost:8080 -t api
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database config
define('DB_HOST', 'localhost');
define('DB_NAME', 'admission_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getPDO() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=".DB_HOST.";charset=".DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `".DB_NAME."`");
        $pdo->exec("USE `".DB_NAME."`");
    }
    return $pdo;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim($uri, '/');
$parts = explode('/', $path);
$endpoint = $parts[0] ?? '';
$action = $parts[1] ?? '';

// Routes
switch ($endpoint) {
    case 'api':
        handleApi($method, $parts[1] ?? '', $parts[2] ?? '');
        break;
        
    case 'setup':
        include __DIR__ . '/db_setup.php';
        exit;
        
    default:
        // Root API status
        echo json_encode([
            'success' => true,
            'message' => 'Admission Dashboard API v1.0 - Backend Ready',
            'base_url' => 'http://localhost:8080',
            'endpoints' => [
                'POST /api/admin/login',
                'POST /setup' 
            ],
            'admins' => [
                'john.smith@admission.edu / admin123',
                'sarah.johnson@admission.edu / admin123'
            ]
        ]);
        break;
}

function handleApi($method, $resource, $action) {
    switch ($resource) {
        case 'admin':
            if ($action === 'login' && $method === 'POST') {
                adminLogin();
            } else {
                notFound();
            }
            break;
            
        default:
            notFound();
    }
}

function adminLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password required']);
        return;
    }
    
    try {
        $pdo = getPDO();
        
        // Ensure admins table
        $pdo->exec("CREATE TABLE IF NOT EXISTS admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            role VARCHAR(50) DEFAULT 'admin',
            department VARCHAR(100),
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");
        
        // Default admins (matching frontend Login.tsx)
        $defaultAdmins = [
            ['john.smith@admission.edu', 'John', 'Smith', 'super_admin', 'Admissions', password_hash('admin123', PASSWORD_DEFAULT)],
            ['sarah.johnson@admission.edu', 'Sarah', 'Johnson', 'officer', 'Admissions', password_hash('admin123', PASSWORD_DEFAULT)],
        ];
        
        foreach ($defaultAdmins as $adminData) {
            $list = [$adminData[0]];
            $check = $pdo->prepare("SELECT id FROM admins WHERE email = ?");
            $check->execute($list);
            if (!$check->fetch()) {
                $stmt = $pdo->prepare("INSERT INTO admins (email, first_name, last_name, role, department, password_hash) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute($adminData);
            }
        }
        
        // Authenticate
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = ?");
        $stmt->execute([$email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($admin && password_verify($password, $admin['password_hash'])) {
            $token = bin2hex(random_bytes(32));
            $roles = [
                'super_admin' => 'Super Admin',
                'officer' => 'Admission Officer',
                'admin' => 'Admin'
            ];
            $role_label = $roles[$admin['role']] ?? 'Admin';
            
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'id' => (int)$admin['id'],
                    'admin_id' => (int)$admin['id'],
                    'email' => $admin['email'],
                    'first_name' => $admin['first_name'],
                    'last_name' => $admin['last_name'],
                    'role' => $admin['role'],
                    'role_label' => $role_label,
                    'department' => $admin['department'],
                    'token' => $token
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Server error']);
    }
}

function notFound() {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
}
?>

